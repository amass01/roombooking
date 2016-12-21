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
const htmlmin = require('gulp-htmlmin');
const ngTemplates = require('gulp-ng-templates');


src = {
  views: ['./src/views/**/*.html'],
  scss: ['./src/styles/**/*.*css'],
  css: ['./src/css/**/*.css'],
  cssMinified: ['./src/css/min/**/*.css'],
  js : [
    './src/app.js',
    './src/**/*.module.js',
    './src/**/*.config.js',
    './src/**/*.service.js',
    './src/**/*.factory.js',
    './src/**/*.directive.js',
    './src/**/*.controller.js',
    './src/**/*.filter.js',
    './src/**/*.component.js',
    './src/**/*.animation.js',
  ],
};

/*** ANGULAR TEMPLATES ***/
gulp.task('ngTemplates', function () {
  return gulp.src(src.views)
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(ngTemplates({
      filename: 'templates.module.js',
      module: 'roomsbooking.templates',
      path: function (path, base) {
        return path.replace(base, ['views/']);
      },
      header: '(function(angular){angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {',
      footer: '}]);}(angular));'
    }))
    .pipe(gulp.dest('./src/bundles'));
});

/*** PACK JS LIB ***/
gulp.task('pack-lib', function () {
  return gulp.src([
    "./node_modules/angular/angular.min.js",
    "./node_modules/angular-ui-router/release/angular-ui-router.min.js",
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
    './src/bundles',
  ]);
});

/*** DEPLOY ***/
gulp.task('deploy', function (done) {

  return sequence('clean', 'ngTemplates', 'pack-lib', 'pack-scripts', 'sass', 'minify-css', 'pack-css', 'index-html', done);

});

gulp.task('watch', function() {
  gulp.watch(src.js, ['deploy']);
  gulp.watch(src.scss, ['deploy']);
});