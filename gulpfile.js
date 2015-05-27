var gulp = require('gulp');
var util = require('gulp-util');
var ls = require('gulp-livescript');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat-util');
var argv = require('minimist')(process.argv.slice(2));
var minifyCSS = require('gulp-minify-css');
var chmod = require('gulp-chmod');
var changed = require('gulp-changed');

var path = {
  layouts: './src/layouts/**/*.jade',
  jade: './src/**/*.jade',
  stylus: './src/stylus/*.styl',
  stylusAll: './src/stylus/**/*.styl',
  css: './src/stylesheets/**/*.css',
  scripts: {
    app: './src/scripts/app/**/*.ls',
    vendor: './src/scripts/vendor/**/*.js'
  },
  images: [
    './src/images/**/*.jpg',
    './src/images/**/*.png',
    './src/images/**/*.gif'
  ],
  svg: './src/images/**/*.svg',
  fonts: './src/fontes/**/*.ttf',
  modules: {
    css:'./bower_components/**/*.css' ,
    js: './bower_components/**/*.js'
  },
  favicon: './src/favicon.ico',
  dest: {
    root: './www/',
    css: './www/css/',
    js: './www/js/',
    img: './www/img',
    fonts: './www/fonts'
  }
};

gulp.task('compile:html', function() {
  var jadeOpts = {};
  var t = gulp.src([path.jade, '!'+path.layouts]);

  if (!argv.u) {
    jadeOpts.pretty = true;
  }

  t = t.pipe(jade(jadeOpts));
  t = t.pipe(gulp.dest(path.dest.root));
});

gulp.task('compile:css', function () {
  var t = gulp.src(path.stylus);
  t = t.pipe(stylus({
    use: [(require("nib")())]
  }));

  if (argv.c) {
    t = t.pipe(minifyCSS());
  }

  t = t.pipe(gulp.dest(path.dest.css));
});

gulp.task('concat:stylesheets', function() {
  var t = gulp.src(path.css);
  t = t.pipe(concat("vendor.css"));

  if (argv.c) {
    t = t.pipe(minifyCSS());
  }

  t = t.pipe(chmod(766));
  t = t.pipe(gulp.dest(path.dest.css));
});

gulp.task('concat:scripts:app', function() {
  var t = gulp.src(path.scripts.app);
  t = t.pipe(ls({bare: true}).on('error', util.log));

  if (!argv.u) {
    t = t.pipe(concat.header('// file: <%= file.path %>\n\n'))
  }

  t = t.pipe(concat("application.js"));

  if (argv.u) {
    t = t.pipe(uglify());
  }

  t = t.pipe(chmod(766));
  t = t.pipe(gulp.dest(path.dest.js));
});

gulp.task('concat:scripts:vendor', function() {
  var t = gulp.src(path.scripts.vendor);
  t = t.pipe(concat("vendor.js"));

  if (argv.u) {
    t = t.pipe(uglify());
  }

  t = t.pipe(gulp.dest(path.dest.js));
});

gulp.task('copy:modules:js', function() {
  var t = gulp.src(path.modules.js);

  if (argv.u) {
    t = t.pipe(uglify());
  }

  t = t.pipe(gulp.dest(path.dest.js));
});

gulp.task('copy:modules:css', function() {
  var t = gulp.src(path.modules.css);

  if (argv.u) {
    t = t.pipe(minifyCSS());
  }

  t = t.pipe(gulp.dest(path.dest.css));
});

gulp.task('compress:images', function() {
  gulp.src(path.images)
    .pipe(changed(path.dest.img))
    .pipe(gulp.dest(path.dest.img));
});

gulp.task('copy:fonts', function() {
  gulp.src(path.fonts)
    .pipe(changed(path.dest.fonts))
    .pipe(gulp.dest(path.dest.fonts));
});

gulp.task('copy:favicon', function() {
  gulp.src(path.favicon)
    .pipe(changed(path.dest.root))
    .pipe(gulp.dest(path.dest.root));
});

gulp.task('build', ['compile:html', 'compile:css', 'concat:stylesheets', 'concat:scripts:app', 'concat:scripts:vendor', 'copy:modules:js', 'copy:modules:css', 'compress:images', 'copy:fonts', 'copy:favicon']);

gulp.task('watch', function() {
  gulp.watch(path.jade, ['compile:html']);
  gulp.watch(path.stylusAll, ['compile:css']);
  gulp.watch(path.css, ['concat:stylesheets']);
  gulp.watch(path.scripts.app, ['concat:scripts:app']);
  gulp.watch(path.scripts.vendor, ['concat:scripts:vendor']);
  gulp.watch(path.scripts.vendor, ['copy:modules:js']);
  gulp.watch(path.scripts.vendor, ['copy:modules:css']);
  gulp.watch(path.images, ['compress:images']);
  gulp.watch(path.fontes, ['copy:fonts']);
  gulp.watch(path.fontes, ['copy:favicon']);
});

gulp.task('default', ['build', 'watch']);
