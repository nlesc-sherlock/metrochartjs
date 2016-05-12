
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
var tape = require('gulp-tape');
var tapcolorize = require('tap-colorize');
var tapspec = require('tap-spec');



// remove the build directory and its contents
gulp.task('clean-build',
    function() {
        'Remove the ./build directory and its contents'
        return del.sync([
            // delete everything under ./build/ as well as the directory itself
            './build',
        ]);
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


gulp.task('tslint',
    'Lints typescript with tslint according to configuration from tslint.json',
    function(callbackWhenDone) {

        gulp.src('src/**/*.ts')
            .pipe(tslint())
            .pipe(tslint.report('verbose'));

        callbackWhenDone();
    }
);


// transpile typescript into javascript
var tsProject = ts.createProject('tsconfig.json');
gulp.task('ts', ['tslint'],
    function(callbackWhenDone) {
        'Transpile typescript into javascript according to tsconfig.json'
        var tsResult = tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

        tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("./"));

        callbackWhenDone();
    }
);


// generate documentation
gulp.task('tsdoc',
    function() {
        'Generate the TypeDoc documentation'

        return gulp.src(['src/**/*.ts']).pipe(typedoc({
                module: 'commonjs',
                target: 'es5',
                out: './build/tsdoc',
                name: packageinfo.name + ' v' + packageinfo.version
            }));
    }
);


// Populate ./build/ directory
gulp.task('build', ['ts', 'css', 'html', 'data']);





var tsProjectTests = ts.createProject('src/test/tsconfig.json')

// compile typescript
gulp.task('build-tests', ['ts'],
    function() {
        'Compiles typescript to javascript according to tsconfig.json'
        var tsResult = tsProjectTests.src()
            .pipe(sourcemaps.init())
            .pipe(ts(tsProjectTests));

        return tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("./build/test"));
    });


gulp.task('test', ['build-tests'],
    function() {
      'Runs tests'
      return gulp.src('build/test/**/*.test.js')
          .pipe(tape({
              reporter: tapcolorize().pipe(tapspec())
          }));
    });





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


// copy .nojekyll files to build/ in order to be able to use the tsdoc from
// github.io (see https://github.com/blog/572-bypassing-jekyll-on-github-pages)
gulp.task('nojekyll',
    function(callbackWhenDone) {
        'Copies the .nojekyll file to the publish/ directory'

        gulp.src('./.nojekyll').pipe(gulp.dest('./publish/'));

        callbackWhenDone();

    }
);


// copy the files from build/ to directory publish/, so that it can be published
// on gh-pages
gulp.task('publish', ['build', 'nojekyll'],
    function() {
        'Copies the finished product from build/ to publish/ so that it can be published on gh-pages'
        gulp.src(['./build/demo/**/*']).pipe(gulp.dest('./publish/demo/'));
    }
);



// Remove ./build/ and ./publish/ directories
gulp.task('clean', ['clean-build', 'clean-publish']);
