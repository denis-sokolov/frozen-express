# Frozen Express

Frozen Express generates a collection of static files for an Express.js application allowing to host said application easily and cheaply.

[![Build Status](https://travis-ci.org/denis-sokolov/frozen-express.svg?branch=master)](https://travis-ci.org/denis-sokolov/frozen-express)
[![Code Climate](http://img.shields.io/codeclimate/github/denis-sokolov/frozen-express.svg)](https://codeclimate.com/github/denis-sokolov/frozen-express)
[![Dependency Status](https://gemnasium.com/denis-sokolov/frozen-express.svg)](https://gemnasium.com/denis-sokolov/frozen-express)

## Usage

```javascript
var frozen = require('frozen-express');

var stream = frozen(app, {
    routes: [
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
    routes: [
        '/'
    ]
}).pipe(gulp.dest('./dist'));
```

You can also include it in your Gulp workflow and perform more tasks with files.
