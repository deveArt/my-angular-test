'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const webserver = require('gulp-webserver');
const del = require('del');

var karma = require('karma').Server;

gulp.task('clean', function() {
    return del(['public/']);
});

gulp.task('sass', function () {
    return gulp.src(['app/assets/scss/**/*.scss', 'app/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'));
});

gulp.task('concat', function () {
    return gulp.src([
            'app/*module.js',
            'app/**/*module.js',
            'app/*!(module).js',
            'app/**/*!(module).js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'));
});

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('sass', 'concat')
));

gulp.task('webserver', function() {
    return gulp.src('./')
        .pipe(webserver({
            host: '127.0.0.1',
            port: 8080,
            fallback: 'index.html',
            livereload: {
                enable: true, // need this set to true to enable livereload
                filter: fileName => fileName.match(/.map$/)? false: true
            }
        }));
});

gulp.task('watch', function () {
    gulp.watch(['app/assets/scss/**/*.scss', 'app/**/*.scss'], gulp.series('sass'));
    gulp.watch(['*.html', 'app/**/*.html', 'app/**/*.js'], gulp.series('concat'));
});

gulp.task('start', gulp.parallel('build', 'watch', 'webserver'));

/**
 * Run tests
 */
gulp.task('test', function (done) {
    new karma({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});