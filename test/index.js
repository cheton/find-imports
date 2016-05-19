import { test } from 'tap';
import findImports from '..';

test('Pass a single file.', (t) => {
    const result = findImports('index.js');
    const wanted = {
        'index.js': [ 'babel-core', 'esprima', 'glob' ]
    };
    t.same(result, wanted);
    t.end();
});

test('Pass a list of glob patterns.', (t) => {
    const files = [
        'index.js',
        'test/**/*.js'
    ];
    const result = findImports(files);
    const wanted = {
        'index.js': [ 'babel-core', 'esprima', 'glob' ],
        'test/index.js': [ 'tap', '..' ]
    };
    t.same(result, wanted);
    t.end();
});
