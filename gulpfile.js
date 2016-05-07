var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var globify = require('require-globify');


gulp.task('factory', function() {

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

gulp.task('browserify', function() {

    browserify({
        entries: './test-src/browserify.js',
        debug: true,
        standalone: 'browserify'
    })
        .transform(babelify, {presets: ['es2015']})
        .transform(globify)
        .bundle()
        .pipe(source('browserify.js'))
        .pipe(gulp.dest('./test/browser'));
});

gulp.task('watch', function() {
    gulp.watch('./src/factory.js', ['factory']);
    gulp.watch('./test-src/browserify.js', ['browserify']);

});

gulp.task('default', ['factory', 'browserify', 'watch']);