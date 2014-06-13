# Frozen Express

Frozen Express generates a collection of static files for an Express.js application allowing to host said application easily and cheaply.

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
