
// The dependencies are wonky:
// gulp clean-build
// gulp build
// gulp clean-publish
// gulp publish
// works, but trying to do the same through dependencies doesn't work yet. Probably
// due to a callback missing/notworking as expected/async problem. Possibly
// easiest solution is to wait for gulp v4.0.0, which apparently can execute
// tasks in a given order

var gulp = require('gulp-help')(require('gulp'));
var del = require('del');
var tslint = require('gulp-tslint');
var sourcemaps = require("gulp-sourcemaps");
var ts = require('gulp-typescript');
var concatCss = require('gulp-concat-css');
var typedoc = require("gulp-typedoc");
var packageinfo = require('./package.json');




// remove the build directory and its contents
gulp.task('clean-build',
    'Remove the ./build directory and its contents',
    function() {
        return del.sync([
            // delete everything under ./build/ as well as the directory itself
            './build',
        ]);
    }
);




// transpile typescript into javascript
var tsProject = ts.createProject('tsconfig.json');
gulp.task('ts',
    'Transpile typescript into javascript according to tsconfig.json',
    function(callbackWhenDone) {
        var tsResult = tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

        tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("./"));

        callbackWhenDone();
    }
);




gulp.task('tslint',
    'Lints typescript with tslint according to configuration from tslint.json',
    function(callbackWhenDone) {

        gulp.src('src/**/*.ts')
            .pipe(tslint())
            .pipe(tslint.report('verbose'));

        callbackWhenDone();
    }
);





// concatenate css and copy the result to build/
gulp.task('css',
    'Concatenates css files',
    function(callbackWhenDone) {
        gulp.src('src/**/*.css')
            .pipe(concatCss('bundle.css'))
            .pipe(gulp.dest('build/demo/styles/'));

        callbackWhenDone();
    }
);




// copy html files to build/
gulp.task('html',
    'Copies html to build directory',
    function(callbackWhenDone) {

        gulp.src('./src/*.html').pipe(gulp.dest('./build/demo'))

        callbackWhenDone();
    }
);




// copy data files to build/demo
gulp.task('data',
    'Copies the test data to build/demo/data/ directory',
    function(callbackWhenDone) {

        gulp.src('./data/*.json').pipe(gulp.dest('./build/demo/data/'));

        callbackWhenDone();

    }
);




gulp.task('build',
    'Populate ./build/ directory',
    function(){
        gulp.start('clean-build');
        gulp.start('ts');
        gulp.start('tslint');
        gulp.start('css');
        gulp.start('html');
        gulp.start('data');
    }
);




// remove the publish directory and its contents
gulp.task('clean-publish',
    'Remove the ./publish directory and its contents',
    function() {
        return del.sync([
            // delete everything under ./publish/ as well as the directory itself
            './publish',
        ]);
    }
);




// copy the files from build/ to directory publish/, so that it can be published
// on gh-pages
gulp.task('publish',
    'Copies the finished product from build/ to publish/ so that it can be published on gh-pages',
    function() {

        gulp.start('clean-publish');

        gulp.src(['./build/**/*']).pipe(gulp.dest('./publish/'));

    }
);




gulp.task('clean',
    'Remove ./build/ and ./publish/ directories',
    function(callbackWhenDone) {
        gulp.start('clean-build');
        gulp.start('clean-publish');
        callbackWhenDone();
    }
);




// generate documentation
gulp.task('tsdoc',
    'Generate the TypeDoc documentation',
    function() {
        return gulp.src(['src/**/*.ts']).pipe(typedoc({
                module: 'commonjs',
                target: 'es5',
                out: './build/tsdoc',
                name: packageinfo.name + ' v' + packageinfo.version
            }));
    }
);




