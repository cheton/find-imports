import { test } from 'tap';
import findImports from '..';

test('should skip directory in glob pattern', (t) => {
    const list = [
        'test/fixtures/'
    ];
    const result = findImports(list);
    const wanted = {};
    t.same(result, wanted);
    t.end();
});

test('polyfill', (t) => {
    const result = findImports('test/fixtures/polyfill.js');
    const wanted = {
        'test/fixtures/polyfill.js': [
            'es5-shim/es5-shim',
            'es5-shim/es5-sham',
            'es6-shim/es6-shim',
            'es6-shim/es6-sham',
            'es6-symbol/implement',
            'es7-shim/es7-shim',
            'imports?this=>window!js-polyfills/cssom',
            'imports?self=>window!js-polyfills/dom',
            'imports?self=>window!js-polyfills/fetch',
            'imports?self=>window!js-polyfills/html',
            'imports?self=>window!js-polyfills/keyboard',
            'imports?this=>window!js-polyfills/timing',
            'imports?self=>window!js-polyfills/typedarray',
            'imports?self=>window!js-polyfills/url',
            'imports?self=>window!js-polyfills/web',
            'imports?self=>window!js-polyfills/xhr'
        ]
    };
    t.same(result, wanted);
    t.end();
});

test('single glob pattern', (t) => {
    const result = findImports('test/fixtures/app.js');
    const wanted = {
        'test/fixtures/app.js': [
            'lodash',
            'fs',
            'path',
            'express',
            'consolidate',
            'errorhandler',
            'serve-favicon',
            'cookie-parser',
            'body-parser',
            'connect-multiparty',
            'connect-restreamer',
            'method-override',
            'morgan',
            'compression',
            'serve-static',
            'express-session',
            'session-file-store',
            'i18next',
            'i18next-node-fs-backend',
            'del',
            'i18next-express-middleware',
            'hogan.js'
        ]
    };
    t.same(result, wanted);
    t.end();
});

test('a list of glob patterns', (t) => {
    const files = [
        'test/fixtures/**/app.js',
        'test/fixtures/**/app.spec.js'
    ];
    const result = findImports(files);
    const wanted = {
        'test/fixtures/app.js': [
            'lodash',
            'fs',
            'path',
            'express',
            'consolidate',
            'errorhandler',
            'serve-favicon',
            'cookie-parser',
            'body-parser',
            'connect-multiparty',
            'connect-restreamer',
            'method-override',
            'morgan',
            'compression',
            'serve-static',
            'express-session',
            'session-file-store',
            'i18next',
            'i18next-node-fs-backend',
            'del',
            'i18next-express-middleware',
            'hogan.js'
        ],
        'test/fixtures/app.spec.js': [
            'tap'
        ]
    };
    t.same(result, wanted);
    t.end();
});

test('flatten output', (t) => {
    const files = [
        'test/fixtures/**/app.js',
        'test/fixtures/**/app.spec.js'
    ];
    const result = findImports(files, { flatten: true });
    const wanted = [
        'lodash',
        'fs',
        'path',
        'express',
        'consolidate',
        'errorhandler',
        'serve-favicon',
        'cookie-parser',
        'body-parser',
        'connect-multiparty',
        'connect-restreamer',
        'method-override',
        'morgan',
        'compression',
        'serve-static',
        'express-session',
        'session-file-store',
        'i18next',
        'i18next-node-fs-backend',
        'del',
        'i18next-express-middleware',
        'hogan.js',
        'tap'
    ];
    t.same(result, wanted);
    t.end();
});

test('relative imports', (t) => {
    const files = [
        'test/fixtures/relative-imports.js',
    ];
    const result = findImports(files, { relativeImports: true });
    const wanted = {
        'test/fixtures/relative-imports.js': [
            './lib/urljoin',
            './lib/log',
            './config/settings',
            './api',
            './lib/middleware/errclient',
            './lib/middleware/errlog',
            './lib/middleware/errnotfound',
            './lib/middleware/errserver',
            './index.css'
        ]
    };
    t.same(result, wanted);
    t.end();
});

test('absolute imports', (t) => {
    const files = [
        'test/fixtures/absolute-imports.js',
    ];
    const result = findImports(files, { absoluteImports: true });
    const wanted = {
        'test/fixtures/absolute-imports.js': [
            '/lib/urljoin',
            '/lib/log',
            '/config/settings',
            '/api',
            '/lib/middleware/errclient',
            '/lib/middleware/errlog',
            '/lib/middleware/errnotfound',
            '/lib/middleware/errserver',
            '/index.css'
        ]
    };
    t.same(result, wanted);
    t.end();
});

test('only package imports', (t) => {
    const files = [
        'test/fixtures/mock-imports.js'
    ];
    const result = findImports(files);
    const wanted = {
        'test/fixtures/mock-imports.js': [
            'package1',
            'package2',
            'package3',
            'package4/extras'
        ]
    };
    t.same(result, wanted);
    t.end();
});

test('no package imports', (t) => {
    const files = [
        'test/fixtures/mock-imports.js'
    ];
    const result = findImports(files, { packageImports: false });
    const wanted = {
        'test/fixtures/mock-imports.js': [
        ]
    };
    t.same(result, wanted);
    t.end();
});

test('only absolute imports', (t) => {
    const files = [
        'test/fixtures/mock-imports.js'
    ];
    const result = findImports(files, { absoluteImports: true, packageImports: false });
    const wanted = {
        'test/fixtures/mock-imports.js': [
            '/absolute1',
            '/absolute2',
            '/absolute3',
            '/absolute4/extras'
        ]
    };
    t.same(result, wanted);
    t.end();
});

test('only relative imports', (t) => {
    const files = [
        'test/fixtures/mock-imports.js'
    ];
    const result = findImports(files, { relativeImports: true, packageImports: false });
    const wanted = {
        'test/fixtures/mock-imports.js': [
            './relative1',
            './relative2',
            './relative3',
            './relative4/extras'
        ]
    };
    t.same(result, wanted);
    t.end();
});

test('syntax errors', (t) => {
    const result = findImports('test/fixtures/syntax-errors.js');
    const wanted = {};
    t.same(result, wanted);
    t.end();
});

test('negative glob', (t) => {
    const list = [
        'test/fixtures/**/app*.js',
        '!test/fixtures/**/*.spec.js' // exclude *.spec.js
    ];
    const result = findImports(list, { flatten: true });
    const wanted = [
        'lodash',
        'fs',
        'path',
        'express',
        'consolidate',
        'errorhandler',
        'serve-favicon',
        'cookie-parser',
        'body-parser',
        'connect-multiparty',
        'connect-restreamer',
        'method-override',
        'morgan',
        'compression',
        'serve-static',
        'express-session',
        'session-file-store',
        'i18next',
        'i18next-node-fs-backend',
        'del',
        'i18next-express-middleware',
        'hogan.js'
    ];
    t.same(result, wanted);
    t.end();
});
