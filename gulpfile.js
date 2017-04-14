var browserify = require('browserify'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    inject = require('gulp-inject'),
    del = require('del'),
    runSequence = require('run-sequence');

var isProduction = function () {
  return argv ? argv.production : false;
}

gulp.task('js', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/js/index.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(!isProduction, sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(!isProduction, sourcemaps.write('./')))
    .pipe(gulpif(isProduction, uglify()))
    .pipe(gulpif(isProduction, rename({suffix: '.min'})))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('css', function () {
    return gulp.src('src/sass/style.scss')
          .pipe(gulpif(!isProduction, sourcemaps.init()))
          .pipe(sass())
          .pipe(gulpif(!isProduction, sourcemaps.write()))
          .pipe(gulpif(isProduction, cssnano()))
          .pipe(gulpif(isProduction, rename({suffix: '.min'})))
          .pipe(gulp.dest('dist'))
});

gulp.task('clean:dist', function() {
  return del(['dist/']);
})

gulp.task('watch', function () {
    return gulp.watch(['src/**/*.html', 'src/**/*.scss', 'src/**/*.js'], ['default'])
            .on('change', function (event) {
                console.log('building...');
            });
});

gulp.task('default', function (cb) {
  runSequence('clean:dist', ['js', 'css'], cb);
})
