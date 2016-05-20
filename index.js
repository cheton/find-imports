var babel = require('babel-core');
var esprima = require('esprima');
var glob = require('glob');

// @params {string|array} patterns The glob pattern or a list of glob patterns
// @params {object} options The options object
// @params {boolean} [options.absoluteImports] True to return absolute imports, defaults to false
// @params {boolean} [options.relativeImports] True to return relative imports, defaults to false
var findImports = function(patterns, options) {
    var requiredModules = {};
    var filenames = [];

    // patterns
    patterns = [].concat(patterns || []);
    patterns.forEach(function(pattern) {
        filenames = filenames.concat(glob.sync(pattern));
    });

    // options
    options = options || {};

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

                    var value = node.expression.arguments[0].value;
                    if (value[0] === '/' && !options.absoluteImports) {
                        return;
                    }
                    if (value[0] === '.' && !options.relativeImports) {
                        return;
                    }
                    requiredModules[filename].push(value);
                } else if (node.type === 'VariableDeclaration') {
                    node.declarations.forEach(function(decl) {
                        if (!decl.init ||
                            decl.init.type !== 'CallExpression' ||
                            decl.init.callee.name !== 'require') {
                            return;
                        }

                        var value = decl.init.arguments[0].value;
                        if (value[0] === '/' && !options.absoluteImports) {
                            return;
                        }
                        if (value[0] === '.' && !options.relativeImports) {
                            return;
                        }
                        requiredModules[filename].push(value);
                    });
                }
            });
        } catch (e) {
            console.error('Error in `' + filename + '`: ' + e);
        }
    });

    return requiredModules;
};

module.exports = findImports;
