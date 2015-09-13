'use strict';

var debug = require('gulp-debug');

var gulp = require('gulp');
var del = require('del');
// var path = require('path');

// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');

var browserSync = require('browser-sync');
var reload = browserSync.reload;


var source = require('vinyl-source-stream'),
    sourceScriptFile = './app/scripts/main.js',
    destScriptFolder = './dist/scripts/',
    destScriptFileName = 'main.js';
var buffer = require('vinyl-buffer');

var bowerFiles = require('main-bower-files');

// Clean
gulp.task('clean', function(cb) {
    $.cached.caches = {};
    del.sync(['dist/styles', 'dist/scripts', 'dist/images', 'dist/fonts', 'dist/*']);
    cb();
});

// Scripts
var debugBundler = watchify(browserify({
    entries: [sourceScriptFile],
    debug: true,
    insertGlobals: true,
    cache: {},
    packageCache: {},
    fullPaths: true
}));
debugBundler.on('update', debugBundle);
debugBundler.on('log', $.util.log);

// bundle with watch & reload
function debugBundle() {
    return debugBundler.bundle()
        // log errors if they happen
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe(source(destScriptFileName))
        .pipe(gulp.dest(destScriptFolder))
        .on('end', function() {
            reload();
        });
}
gulp.task('debugScripts', debugBundle);

// bundle and quit
gulp.task('scripts', function() {
    return browserify(sourceScriptFile)
        .bundle()
        .pipe(source(destScriptFileName))
        .pipe(buffer())
        // .pipe($.stripDebug())
        // .pipe($.uglify())
        .pipe(gulp.dest(destScriptFolder));
});

// Styles
gulp.task('debugStyles', ['debugSass']);
gulp.task('styles', ['sass']);

gulp.task('debugSass', function() {
    return $.rubySass('./app/styles/**/*.scss', {
            style: 'expanded',
            precision: 10,
            loadPath: ['app/bower_components'],
            sourcemap: true
        })
        .on('error', $.rubySass.logError)
        .pipe($.sourcemaps.write())
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});

gulp.task('sass', function() {
    return $.rubySass('./app/styles/**/*.scss', {
            style: 'expanded',
            precision: 10,
            loadPath: ['app/bower_components']
        })
        .on('error', $.rubySass.logError)
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});

// HTML
gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe($.cached('html'))
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

// Images
gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe($.cached('images'))
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src(bowerFiles({
                filter: '**/*.{eot,svg,ttf,woff,woff2}'
            })
        )
        .pipe(gulp.dest('dist/fonts'));
});

// Bundle
var doBundling = function() {
    return gulp.src('./app/*.html')
        .pipe($.useref.assets())
        .pipe($.useref.assets().restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
};
gulp.task('devBundle', ['debugStyles', 'debugScripts'], function() {
    doBundling();
});
gulp.task('bundle', ['styles', 'scripts'], function() {
    doBundling();
});

// Robots.txt and favicon.ico
gulp.task('extras', function() {
    return gulp.src(['app/*.txt', 'app/*.ico'])
        .pipe($.cached('extras'))
        .pipe(gulp.dest('dist/'))
        .pipe($.size());
});

// Watch
gulp.task('watch', ['html', 'fonts', 'devBundle'], function() {

    browserSync({
        notify: false,
        logPrefix: 'BS',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['dist', 'app']
    });

    // Watch .json files
    gulp.watch('app/scripts/**/*.json', ['json']);

    // Watch .html files
    gulp.watch('app/*.html', ['html']);

    gulp.watch(['app/styles/**/*.scss', 'app/styles/**/*.css'], ['debugStyles', 'debugScripts', reload]);

    // Watch image files
    gulp.watch('app/images/**/*', reload);
});

// Build
gulp.task('build', ['html', 'bundle', 'images', 'fonts', 'extras'], function() {
});

// Default task
gulp.task('default', ['clean', 'build']);
