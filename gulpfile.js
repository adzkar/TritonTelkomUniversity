'use strict'

// dokumentasi
// https://css-tricks.com/gulp-for-beginners/


var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('hello', function() {
	console.log('Hello World');
});

gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss')
      .pipe(sourcemaps.init())
		.pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app',
			routes: {
				"/bower_components": "bower_components"
			}
		},
	})
});

gulp.task('images', function(){
  return gulp.src('app/pic/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/pic'))
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('fonts', function() {
  return gulp.src('app/font/**/*')
  .pipe(gulp.dest('dist/font'))
})

// font-awesome
gulp.task('font-awesome', function() {
    return gulp.src('bower_components/font-awesome/web-fonts-with-css/webfonts/**/*')
            .pipe(gulp.dest('dist/webfonts/'));
});


gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/pic', '!dist/pic/**/*']);
});

gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/scss/**/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});


gulp.task('build', function (callback) {
  runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts', 'font-awesome'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})

