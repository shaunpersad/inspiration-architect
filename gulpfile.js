var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

gulp.task('browserify', function() {

    browserify({
        entries: './src/factory.js',
        debug: true,
        standalone: 'inspirationArchitectFactory'
    })
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .pipe(source('inspiration-architect.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});

gulp.task('basicTests', function() {

    browserify({
        entries: './src/basic-tests.js',
        debug: true,
        standalone: 'basicTests'
    })
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .pipe(source('basic-tests.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./test'));
});

gulp.task('watch', function() {
    gulp.watch('./src/factory.js', ['browserify']);
    gulp.watch('./src/basic-tests.js', ['basicTests']);

});

gulp.task('default', ['browserify', 'basicTests', 'watch']);