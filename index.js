var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var babel = require('babel-core');
var esprima = require('esprima');
var glob = require('glob');
var resolveGlob = require('./resolve-glob');

var defaultOptions = {
    packageImports: true,
    absoluteImports: false,
    relativeImports: false
};

// @params {string|array} patterns The glob pattern or a list of glob patterns.
// @params {object} options The options object.
// @params {boolean} [options.flatten] True to flatten the output, defaults to false.
// @params {boolean} [options.packageImports] True to return package imports, defaults to true.
// @params {boolean} [options.absoluteImports] True to return absolute imports, defaults to false.
// @params {boolean} [options.relativeImports] True to return relative imports, defaults to false.
var findImports = function(patterns, options) {
    var requiredModules = {};
    var filepaths = [];
    var addModule = function(modulePath, value) {
        if (value[0] === '/') {
            if (!!options.absoluteImports) {
                requiredModules[modulePath].push(value);
            }
        } else if (value[0] === '.') {
            if (!!options.relativeImports) {
                requiredModules[modulePath].push(value);
            }
        } else if (!!options.packageImports) {
            requiredModules[modulePath].push(value);
        }
    };

    // options
    options = Object.assign({}, defaultOptions, options || {});

    { // glob patterns
        var positives = [];
        var negatives = [];

        patterns = [].concat(patterns || []);
        patterns.forEach(function(pattern) {
            // Make a glob pattern absolute
            pattern = resolveGlob(pattern);

            if (pattern.charAt(0) === '!') {
                negatives = negatives.concat(glob.sync(pattern.slice(1)));
            } else {
                positives = positives.concat(glob.sync(pattern));
            }
        });

        filepaths = _.difference(positives, negatives);
    }

    filepaths.forEach(function(filepath) {
        var stat = fs.statSync(filepath);
        if (!stat.isFile()) {
            return;
        }

        try {
            var result = babel.transformFileSync(filepath);
            var tree = esprima.parse(result.code, {
                sourceType: 'module'
            });
            var modulePath = path.relative(process.cwd(), filepath);

            requiredModules[modulePath] = [];

            tree.body.forEach(function(node) {
                if (node.type === 'ExpressionStatement' &&
                    node.expression.type === 'CallExpression' &&
                    node.expression.callee.type === 'MemberExpression' &&
                    node.expression.callee.object.type === 'CallExpression' &&
                    node.expression.callee.object.callee.name === 'require') {
                    addModule(modulePath, node.expression.callee.object.arguments[0].value);
                    return;
                }

                if (node.type === 'ExpressionStatement' &&
                    node.expression.type === 'CallExpression' &&
                    node.expression.callee.name === 'require') {
                    addModule(modulePath, node.expression.arguments[0].value);
                    return;
                }

                if (node.type === 'VariableDeclaration') {
                    node.declarations.forEach(function(decl) {
                        if (!decl.init ||
                            decl.init.type !== 'CallExpression' ||
                            decl.init.callee.name !== 'require') {
                            return;
                        }

                        addModule(modulePath, decl.init.arguments[0].value);
                    });
                    return;
                }

                if (node.type === 'ImportDeclaration') {
                    addModule(modulePath, node.source.value);
                    return;
                }
            });
        } catch (e) {
            console.error('Error in `' + modulePath + '`: ' + e);
        }
    });

    if (options.flatten) {
        requiredModules = _(requiredModules)
            .toArray()
            .flatten()
            .uniq()
            .value();
    }

    return requiredModules;
};

module.exports = findImports;
