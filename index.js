var babel = require('babel-core');
var esprima = require('esprima');
var glob = require('glob');

var findImports = function(patterns) {
    var requiredModules = {};
    var filenames = [];

    patterns = [].concat(patterns || []);
    patterns.forEach(function(pattern) {
        filenames = filenames.concat(glob.sync(pattern));
    });

    filenames.forEach(function(filename) {
        try {
            var result = babel.transformFileSync(filename);
            var tree = esprima.parse(result.code, {
                sourceType: 'module'
            });
            requiredModules[filename] = [];

            tree.body.forEach(function(node) {
                if (node.type === 'VariableDeclaration') {
                    node.declarations.forEach(function(decl) {
                        if (decl.init &&
                            decl.init.type === 'CallExpression' &&
                            decl.init.callee.name === 'require' &&
                            decl.init.arguments[0].value.indexOf('/') === -1) {
                            requiredModules[filename].push(decl.init.arguments[0].value);
                        }
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
