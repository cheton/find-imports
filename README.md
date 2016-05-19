# find-imports [![build status](https://travis-ci.org/cheton/find-imports.svg?branch=master)](https://travis-ci.org/cheton/find-imports) [![Coverage Status](https://coveralls.io/repos/cheton/find-imports/badge.svg)](https://coveralls.io/r/cheton/find-imports)
[![NPM](https://nodei.co/npm/find-imports.png?downloads=true&stars=true)](https://nodei.co/npm/find-imports/)

Find all imported modules in JavaScript files.

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

## License

Copyright (c) 2016 Cheton Wu

Licensed under the [MIT License](LICENSE).
