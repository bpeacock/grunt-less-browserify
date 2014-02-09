grunt-less-browserify [![Build Status](https://travis-ci.org/wilson428/node-lessify.png)](https://travis-ci.org/wilson428/node-lessify)
============
Version 0.0.1

LESS precompiler and CSS plugin for [grunt-browserify](https://github.com/jmreidy/grunt-browserify). Forked from [node-lessify](https://github.com/wilson428/node-lessify).

When bundling an app using [Browserify](http://browserify.org/), it's often convenient to be able to include your CSS as a script that appends the style declarations to the head. This is particularly relevant for self-assembling apps that attach themselves to a page but otherwise have reserved real-estate on the DOM.

This small script allows you to `require()` your CSS or LESS files as you would any other script.

## Installation

```
npm install grunt-less-browserify
```

## Usage
Write your LESS or CSS files as you normally would, and put them somewhere where your script can find it.

Then simply require them as you might anything else:

```
require('./styles.less');
require('./mysite.css');
```

## Grunt Configuration

```
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'build.js': ['main.js']
        },
        options: {
            transform: ['node-lessify'],
        }
      }
    },
    lessBrowserify: {
        imports: ['helpers.less'],
        output:  'dist/word.css',
        jsAppend: false
    }
  });
};
```

## How it works

The stylesheets are compiled (in the case of LESS), minified, and bundle into a function that creates a new `<style>` element and appends it to the `<head>` using [native Javascript](http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript).


## Imports
LESS allows one to ```@import``` other LESS files. This module synchronously imports those dependencies at the time of the bundling. It looks for the imported files in both the directory of the parent file and the folder where the module itself lives, so it should work so long as the paths in the ```@import``` commands are correct relative to the importing file, as usual. It is not currently tested for recursive importing.
