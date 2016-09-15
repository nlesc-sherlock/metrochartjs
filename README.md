- The TypeDoc is [here](http://nlesc-sherlock.github.io/metrochartjs/sites/tsdoc/).
- The code coverage report is [here](http://nlesc-sherlock.github.io/metrochartjs/sites/coverage/remapped/).



# Documentation for developers



## Setting up, building and running

Get a local copy of the metrochartjs repository using ``git``:

```bash
# use package manager to install git
sudo apt-get install git

# make a local copy of this repository
git clone https://github.com/nlesc-sherlock/metrochartjs.git

# change into punchcardjs directory
cd metrochartjs
```

After getting the source, three things need to be done: `npm` needs to install
local copies of the development tools as well as of client-side dependencies of
our code, and `typings` needs to get the typescript annotations for those. You can
do all of these in one go using:

```bash
# Assuming you already have ``npm`` and ``typings`` installed globally
# on your system, install with:
npm install && typings install
```

We use ``npm`` for the various build tasks (see ``scripts`` in ``packages.json`` for the complete list and their definitions). Here's a summary of the most relevant tasks (see also below for the dependency graph):

```bash
# make a distributable js file, metrochart.js
npm run dist

# run the unit tests against the distributable
npm run test

# do all types of linting:
# tslint on the TypeScript from src/
# csslint on the CSS from src/
# jslint and jshint on the JS from test/
npm run lint

# clean up generated files
npm run clean

# do an npm run clean and additionally throw away any downloaded files
npm run purge

# generate the TypeDoc, inspect afterwards in a browser (output will be at <projectroot>/docs/sites/tsdoc)
npm run tsdoc

# generate code coverage in various formats. output will be at <projectroot>/docs/sites/coverage/, e.g.
# <projectroot>/docs/sites/coverage/remapped/metrochart/index.html
npm run cover

```

## How it all fits together

### General

So you wrote some **source code**. A **distributable** can be created from the source code. Distributables are great, because that's what people can use in their own websites later. However, distributables are only good if they work --you don't want to break other people's websites, now do you? So, the distributable needs to be tested using **unit tests**. For this you typically need to do two things: first, you need to be able to do **assertions**. Assertions help you test different kinds of equality (''is the test result what it is supposed to be?''). Secondly, you need a  **test runner**, i.e. something that runs the tests (and then, typically, reports on their results). Now that you have tests, you also want to generate **code coverage** reports. Code coverage helps to make transparent which parts of the code are covered by tests.

### In our case

- Our **source code** lives at ``src``. The meat of it is written in TypeScript.
- We create the **distributable** using ``npm run`` scripting, so there are no Gulp or Grunt files.
- We use **unit tests** written in the style of [``Jasmine``](http://jasmine.github.io/2.0/introduction.html) (i.e. ``describe()`` and ``it()``).
- Our **assertion** library is also [``Jasmine``](http://jasmine.github.io/2.0/introduction.html) (e.g. ``expect(actual).toEqual(expected)``).
- [Karma](https://karma-runner.github.io/1.0/index.html) is our **test runner**.
- We generate code coverage in different formats using [``karma-coverage``](https://www.npmjs.com/package/karma-coverage). However, this gives us code coverage of the (generated) JavaScript, which is not really what we're interested in. So we have [``remap-istanbul``](https://www.npmjs.com/package/remap-istanbul) figure out which parts of the generated JavaScript correspond with which parts of the (written) TypeScript.

Here is a callgraph generated from [package.json](https://github.com/nlesc-sherlock/metrochartjs/blob/master/package.json) using [https://github.com/jspaaks/npm-scripts-callgraph](https://github.com/jspaaks/npm-scripts-callgraph):

![metrochartjs-callgraph.png](https://github.com/nlesc-sherlock/metrochartjs/raw/master/docs/metrochartjs-callgraph.png "metrochartjs-callgraph.png")


