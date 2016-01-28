
var gulp = require('gulp-help')(require('gulp'));
var tslint = require('gulp-tslint');
var sourcemaps = require("gulp-sourcemaps");
var ts = require('gulp-typescript');
var concatCss = require('gulp-concat-css');
var rimraf = require('rimraf');
var typedoc = require("gulp-typedoc");
var packageinfo = require('./package.json');




// tasks
gulp.task('tslint',
    'Lints typescript with tslint according to configuration from tslint.json',
    function() {
        return gulp.src('src/**/*.ts')
            .pipe(tslint())
            .pipe(tslint.report('verbose'));
    });




// transpile typescript into javascript
var tsProject = ts.createProject('tsconfig.json');
gulp.task('ts',
    'Transpile typescript into javascript according to tsconfig.json',
    function() {
        var tsResult = tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

        return tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("./"));
    });




// generate documentation
gulp.task('tsdoc', function() {
    return gulp
        .src(['src/**/*.ts'])
        .pipe(typedoc({
            module: 'commonjs',
            target: 'es5',
            out: 'tsdoc/',
            name: packageinfo.name + ' v' + packageinfo.version
        }));
});




// concatenate css and copy the result to build/
gulp.task('css',
    'Concatenates css files',
    function() {
        return gulp.src('src/**/*.css')
            .pipe(concatCss('bundle.css'))
            .pipe(gulp.dest('build/styles/'));
    });




// copy html files to build/
gulp.task('html',
    'Copies html to build directory',
    function() {
        gulp.src('./src/*.html').pipe(gulp.dest('./build/'))
    });




// copy html files to build/
gulp.task('data',
    'Copies the test data to build/ directory',
    function() {
        gulp.src('./data/*.json').pipe(gulp.dest('./build/data/'))
    });




gulp.task('clean',
    'Remove files generated in build process',
    function(cb) {
        rimraf('./build', cb);
    });




gulp.task('build',
    'Populate build/ directory', ['ts', 'tslint', 'css', 'html', 'data']);



