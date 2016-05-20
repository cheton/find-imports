# find-imports [![build status](https://travis-ci.org/cheton/find-imports.svg?branch=master)](https://travis-ci.org/cheton/find-imports) [![Coverage Status](https://coveralls.io/repos/cheton/find-imports/badge.svg)](https://coveralls.io/r/cheton/find-imports)
[![NPM](https://nodei.co/npm/find-imports.png?downloads=true&stars=true)](https://nodei.co/npm/find-imports/)

Find all imported modules in JavaScript files. It's useful for bundling 3rd-party libraries into a vendor.js using webpack. For example:

```js
var _ = require('lodash');
var webpack = require('webpack');
var findImports = require('find-imports');

var files = [
    'src/**/*.{js,jsx}'
];
var deps = _(findImports(files))
    .toArray()
    .flatten()
    .uniq()
    .sort()
    .value();

// Webpack Configuration
module.exports = {
    entry: {
        app: [
            './src/index.js'
        ],
        vendor: deps
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
    ]
};
```

## Installation

```bash
npm install --save find-imports
```

## Usage
```js
import findImports from 'find-imports';

const files = [
    // glob pattern
    'src/**/*.{js,jsx}'
];

findImports(files);
// → { 'src/web/index.jsx':
//     [ 'lodash',
//       'async',
//       'jsuri',
//       'react',
//       'react-dom',
//       'react-router' ] }
```

To return absolute and relative imports:
```js
findImports(files, {
    absoluteImports: true,
    relativeImports, true
});
// → { 'src/web/index.jsx':
//     [ 'lodash',
//       'async',
//       'jsuri',
//       'react',
//       'react-dom',
//       'react-router',
//       '/index.styl',
//       './index.css' ] }
```

## License

Copyright (c) 2016 Cheton Wu

Licensed under the [MIT License](LICENSE).
