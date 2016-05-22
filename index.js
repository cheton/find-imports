var _ = require('lodash');
var babel = require('babel-core');
var esprima = require('esprima');
var glob = require('glob');
var lodash = require('lodash');

var defaultOptions = {
    packageImports: true
};

// @params {string|array} patterns The glob pattern or a list of glob patterns.
// @params {object} options The options object.
// @params {boolean} [options.flatten] True to flatten the output, defaults to false.
// @params {boolean} [options.absoluteImports] True to return absolute imports, defaults to false.
// @params {boolean} [options.relativeImports] True to return relative imports, defaults to false.
var findImports = function(patterns, options) {
    var requiredModules = {};
    var filenames = [];

    var addModule = function (filename, value) {
        if (value[0] === '/') {
            if(!!options.absoluteImports) {
                requiredModules[filename].push(value);
            }
        }
        else if (value[0] === '.'){
            if(!!options.relativeImports) {
                requiredModules[filename].push(value);
            }
        }
        else if (!!options.packageImports) {
            requiredModules[filename].push(value);
        }
    };

    // patterns
    patterns = [].concat(patterns || []);
    patterns.forEach(function(pattern) {
        filenames = filenames.concat(glob.sync(pattern));
    });

    // options
    options = options || {};
    options = Object.assign({},defaultOptions,options);

    filenames.forEach(function(filename) {
        try {
            var result = babel.transformFileSync(filename);
            var tree = esprima.parse(result.code, {
                sourceType: 'module'
            });
            requiredModules[filename] = [];

            tree.body.forEach(function(node) {
                if (node.type === 'ExpressionStatement') {
                    if (node.expression.type !== 'CallExpression' ||
                        node.expression.callee.name !== 'require') {
                        return;
                    }

                    addModule(filename, node.expression.arguments[0].value);
                } else if (node.type === 'VariableDeclaration') {
                    node.declarations.forEach(function(decl) {
                        if (!decl.init ||
                            decl.init.type !== 'CallExpression' ||
                            decl.init.callee.name !== 'require') {
                            return;
                        }

                        addModule(filename, decl.init.arguments[0].value);
                    });
                }
            });
        } catch (e) {
            console.error('Error in `' + filename + '`: ' + e);
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
