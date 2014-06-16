# Frozen Express

Frozen Express generates a collection of static files for an Express.js application allowing to host said application easily and cheaply.

Officially only Express 4 applications are supported, but Express 3 application seem to work fine at the moment.

[![Build Status](https://travis-ci.org/denis-sokolov/frozen-express.svg?branch=master)](https://travis-ci.org/denis-sokolov/frozen-express)
[![Code Climate](http://img.shields.io/codeclimate/github/denis-sokolov/frozen-express.svg)](https://codeclimate.com/github/denis-sokolov/frozen-express)
[![Coverage Status](https://img.shields.io/coveralls/denis-sokolov/frozen-express.svg)](https://coveralls.io/r/denis-sokolov/frozen-express?branch=master)
[![Dependency Status](https://gemnasium.com/denis-sokolov/frozen-express.svg)](https://gemnasium.com/denis-sokolov/frozen-express)

## Usage

```javascript
var frozen = require('frozen-express');

var stream = frozen(app, {
    urls: [
        '/',
        '/about',
        '/contact'
    ]
});
```

You can do with the generated `Stream` whatever you want, but the simplest thing is to use `gulp-dest`:

```javascript
var gulp = require('gulp');
var frozen = require('frozen-express');

frozen(app, {
    urls: [
        '/'
    ]
}).pipe(gulp.dest('./dist'));
```

You can also include it in your Gulp workflow and perform more tasks with files.
