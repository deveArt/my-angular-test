'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('app/assets/scss/**/*.scss', {base: 'app/assets/scss'})
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('public/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('app/assets/scss/**/*.scss', ['sass']);
});