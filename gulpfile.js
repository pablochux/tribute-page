// Plugins
var gulp = require('gulp'),
    less = require('gulp-less'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    pump = require('pump'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

// Directories
var src = 'template/src/',
    minsrc = 'template/dist/';

// TASKS
// Default task starts the server in the src folder (development)
gulp.task('default', function(){
	browserSync.init({
		server: src,
		browser: "Google Chrome Canary",
		notify: false
	});

	gulp.watch(src + "less/*.less", ['less']);
	gulp.watch(src + "less/*.less").on("change", reload);
	gulp.watch(src + "*.html").on("change", reload);
	gulp.watch(src + "js/*.js").on("change", reload);
});

// Minify css
gulp.task('minify-css', function(){
    return gulp.src(src + 'css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest(minsrc + 'css'));
});

// Compile the less files
gulp.task("less", function() {
    gulp.src(src + "less/*.less")
        .pipe(less())
        .pipe(gulp.dest(src + 'css'));
});
// Autoprefix all the css
gulp.task('prefix', () =>
    gulp.src(minsrc + 'css/styles.css')
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(minsrc + 'css/'))
);
// Concat all the js files
gulp.task('concat-js', function() {
  return gulp.src(src + 'js/*.js')
    .pipe(concat('script.js'))
    .pipe(gulp.dest(src + 'js/'));
});
// Minify js
gulp.task('minify-js', function (cb) {
  pump([
        gulp.src(src + 'js/script.js'),
        uglify(),
        gulp.dest(minsrc + 'js/')
    ],
    cb
  );
});
// Minify html
gulp.task('minify-html', function() {
  return gulp.src(src + '*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(minsrc))
});
// Compress images in src/img folder
gulp.task('compress-img', () =>
	gulp.src(src + 'img/*')
		.pipe(imagemin())
		.pipe(gulp.dest(minsrc + 'img'))
);

// Finish proyect
// Clean the finish proyect
gulp.task('c-d', function () {
  return del([
    minsrc + '*.html',
    minsrc + '/js/*.js',
    minsrc + '/css/*.css',
    minsrc + '/img/*'
  ]);
});
// Compile, minified and compress all into the dist foler
// NOT WORKING!! fails on less task, not updated, ¡run twice!
gulp.task('f', ['less', 'concat-js', 'minify-js', 'minify-css', 'minify-html', 'compress-img'], function() {
	console.log("Finished");
});
// Starts the server in the dist foler for testing
gulp.task('check-dist', function() {
	browserSync.init({
		server: minsrc,
		browser: "Google Chrome Canary",
		notify: false
	});

	gulp.watch(src + "less/*.less", ['less']);
	gulp.watch(src + "less/*.less").on("change", reload);
	gulp.watch(src + "*.html").on("change", reload);
	gulp.watch(src + "js/*.js").on("change", reload);
});
