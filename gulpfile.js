var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

// plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');


var paths = {
  dist  : 'dist/**',
  js    : 'src/appcache.js',
  tests : 'test/*.js'
};


gulp.task('jshint', function() {
  gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('serve', function() {
  return connect.server();
});

gulp.task('testRun', function() {
  var stream = mochaPhantomJS({ reporter: 'spec', outputEncoding: 'utf8' });
  stream.write({ path: 'http://localhost:8080/test/index.html' });
  stream.write({ path: 'http://localhost:8080/test/index-with-appcache.html '});
  stream.end();
  return stream;
});

gulp.task('test', ['serve', 'testRun'], function() {
  connect.serverClose();
});

gulp.task('build', function() {
  gulp.src(paths.js)
    .pipe(gulp.dest('dist/'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/'));
});


gulp.task('develop', ['serve', 'jshint'], function() {
  gulp.watch(paths.js, ['jshint', 'build']);
  gulp.watch([paths.dist, paths.tests], ['testRun']);
});

gulp.task('ci', ['build', 'test']);