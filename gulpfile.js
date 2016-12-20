const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const ngAnnotate = require('gulp-ng-annotate');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const sequence = require('gulp-sequence');
const watch = require('gulp-watch');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');


src = {
  scss: ['./src/styles/**/*.*css'],
  css: ['./src/css/**/*.css'],
  cssMinified: ['./src/css/min/**/*.css'],
  js : [
    './src/app.js',
    './js/**/*.module.js',
    './js/**/*.config.js',
    './js/**/*.service.js',
    './js/**/*.factory.js',
    './js/**/*.directive.js',
    './js/**/*.controller.js',
    './js/**/*.filter.js',
    './js/**/*.component.js',
    './js/**/*.animation.js',
  ],
};

/*** PACK JS LIB ***/
gulp.task('pack-lib', function () {
  return gulp.src([
    "./node_modules/angular/angular.min.js",
  ])
    .pipe(concat('lib.packed.min.js'))
    .pipe(gulp.dest('./deploy/js'))
});

/*** copy index.html ***/
gulp.task('index-html', function () {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./deploy'));
});

/*** Compile all script files into one output minified JS file. ***/
gulp.task('pack-scripts', function() {


    return gulp.src(src.js)
      .pipe(sourcemaps.init())
      .pipe(ngAnnotate())
      .pipe(concat('app.packed.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./deploy/js'));

});

/*** SASS ***/
gulp.task('sass', function (done) {
  gulp.src(src.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: ['> 1%', 'IE 9']
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./src/css/'))
    .on('end', done);
});

/*** MINIFY CSS ***/
gulp.task('minify-css', function (done) {
  gulp.src(src.css)
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./src/css/min/'))
    .on('end', done);
});

/*** PACK CSS ***/
gulp.task('pack-css', function () {
  return gulp.src(src.cssMinified)
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('./deploy/css'));
});


/*** CLEAN ***/
gulp.task('clean', function (done) {
  return del([
    './deploy/**',
    '!./deploy',
    './src/css',
  ]);
});

/*** DEPLOY ***/
gulp.task('deploy', function (done) {

  return sequence('clean', 'pack-lib', 'pack-scripts', 'sass', 'minify-css', 'pack-css', 'index-html', done);

});

gulp.task('watch', function() {
  gulp.watch(src.js, ['deploy']);
  gulp.watch(src.scss, ['deploy']);
});