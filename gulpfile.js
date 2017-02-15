'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const webserver = require('gulp-webserver');
const del = require('del');

gulp.task('clean', function() {
    return del();
});

gulp.task('sass', function () {
    return gulp.src('app/assets/scss/**/*.scss', {base: 'app/assets/scss'})
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'));
});

gulp.task('concat', function () {
    return gulp.src(['app/**/*.js', 'app/*.js']/*, {since: gulp.lastRun('concat')}*/)
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
            livereload: {
                enable: true, // need this set to true to enable livereload
                filter: fileName => fileName.match(/.map$/)? false: true
            }
        }));
});

gulp.task('watch', function () {
    gulp.watch('app/assets/scss/**/*.scss', gulp.series('sass'));
    gulp.watch(['*.html', 'app/**/*.js'], gulp.series('concat'));
});

gulp.task('start', gulp.parallel('watch', 'webserver'));