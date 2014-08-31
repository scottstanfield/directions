'use strict';

// Note: use this Chrome plugin to enable the Live Reload feature:
// https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
    scripts: ['source/js/*.js'],
    stylus:  ['source/**/*.styl'],
    images:  ['source/img/**/*'],
    css:     ['source/css/**/*.css'],
    jade:    ['source/**/*.jade'],
    statics: ['source/statics/**/*'],
    root:    ['source/root/**']
};

var dest = {
    build:  'build'
};

// Lint Task
gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
});

gulp.task('css', function() {
    return gulp.src(paths.css)
        .pipe(gulp.dest(dest.build + '/css'));
});

gulp.task('revall', function() {
    return gulp.src('build/**')
        .pipe($.revAll())
        .pipe(gulp.dest('s3'));
});

// Compile Our Stylus files
gulp.task('stylus', function() {
    return gulp.src(paths.stylus)
        .pipe($.stylus())
        .pipe($.autoprefixer())
        .pipe(gulp.dest(dest.build))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.minifyCss())
        .pipe(gulp.dest(dest.build));
});

gulp.task('jade', function() {
    return gulp.src(paths.jade)
        .pipe($.jade({pretty: true}))
        .pipe(gulp.dest(dest.build));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe($.concat('all.js'))
        .pipe(gulp.dest(dest.build))
        .pipe($.rename('all.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(dest.build));
});

gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe($.cache($.imagemin({
            optimizationLevel: 7,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(dest.build + '/img'))
        .pipe($.size());
});

gulp.task('clean', function() {
    gulp.src(dest.build, {read:false})
        .pipe($.clean());
});

gulp.task('root', function() {
    gulp.src(paths.root)
        .pipe(gulp.dest(dest.build))
});

gulp.task('statics', function() {
    gulp.src(paths.statics)
        .pipe(gulp.dest(dest.build + '/statics'));
});

gulp.task('cache', function() {
    $.cache.clearAll();
});

gulp.task('webserver', function() {
    gulp.src(['build', '!node_modules'])
        .pipe($.webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['lint', 'scripts']);
    gulp.watch(paths.stylus, ['stylus']);
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.root, ['root']);
    gulp.watch(paths.jade, ['jade']);
});

// these are the two high-level tasks:
// % gulp 
// % gulp debug

gulp.task('default', [ 'root', 'statics', 'jade', 'stylus', 'scripts', 'images', 'css']);
gulp.task('debug', [ 'webserver', 'root', 'statics', 'jade', 'stylus', 'scripts', 'images', 'css', 'watch']);

// gulp.task('default', ['clean'], function() {
//     console.log("about to start build")
//     gulp.start('build')
// });
