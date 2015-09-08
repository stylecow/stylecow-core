# Stylecow core

Fast and furious css framework. For node >= v4.0

[![Build Status](https://travis-ci.org/stylecow/stylecow-core.svg?branch=master)](https://travis-ci.org/stylecow/stylecow-core)

* [See the wiki](https://github.com/stylecow/stylecow-parser/wiki) for more documentation
* [Stylecow home page](http://stylecow.github.io/)

Simple usage example:

```javascript
var stylecow = require('stylecow-core');

//Create a Tasks instance and add some tasks and browser support
var tasks = (new stylecow.Tasks())
	.minSupport({
		explorer: 9,
		firefox: 30,
		chrome: 30,
		safari: 6,
		ios: 6,
		opera: 12
	})
	.use(require('stylecow-plugin-prefixes'))
	.use(require('stylecow-plugin-nested-rules'))
	.use(require('stylecow-plugin-color'));

//Create a Coder instance to minify the css code
var coder = new stylecow.Coder('minify');

//Parse a css file
var css = stylecow.parseFile('styles.css');

//Execute the tasks
tasks.run(css);

//Get the minified code
var code = coder.run(css);
```
