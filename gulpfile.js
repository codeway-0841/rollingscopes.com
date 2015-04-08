var gulp        = require('gulp');
var del         = require('del');
var minimist    = require('minimist');
var runSequence = require('run-sequence');
var pngquant    = require('imagemin-pngquant');
var $           = require('gulp-load-plugins')();

var gulpOptions = require('./gulp-options');
var options = minimist(process.argv.slice(2), gulpOptions);
options.dest = options.src + 'Bin';


gulp.task('clean', function (cb) {
  del([options.dest], cb);
});

gulp.task('imagemin', function () {
  return gulp.src(
    options.src + '/images/**/*'
  )
  .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      multipass: true,
      use: [pngquant()]
  }))
  .pipe(
    gulp.dest(options.dest + '/images')
  );
});

gulp.task('useref', function () {
  var assets = $.useref.assets();

  return gulp.src(
    options.src + '/*.html'
  )
  .pipe(assets)
  .pipe($.if('*.js', $.uglify()))
  .pipe($.if('*.css', $.minifyCss()))
  .pipe(assets.restore())
  .pipe($.useref())
  .pipe($.htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(options.dest));
});

gulp.task('build', function (cb) {
  runSequence(
    'clean',
    ['imagemin', 'useref'],
    cb
  );
});

gulp.task('default', ['build']);
