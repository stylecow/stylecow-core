# Stylecow core

Fast and furious css processor. For node >= v4.0

[![Build Status](https://travis-ci.org/stylecow/stylecow-core.svg?branch=master)](https://travis-ci.org/stylecow/stylecow-core)

* [See the wiki](https://github.com/stylecow/stylecow-parser/wiki) for more documentation
* [Stylecow home page](http://stylecow.github.io/)

Simple usage example:

```javascript
"use strict";

let stylecow = require('stylecow-core');

//Create a Tasks instance and add some stuff
let tasks = (new stylecow.Tasks())

	//minimum browser support
	.minSupport({
		explorer: 9,
		firefox: 30,
		chrome: 30,
		safari: 6,
		ios: 6,
		opera: 12
	})

	//add some plugins
	.use(require('stylecow-plugin-prefixes'))
	.use(require('stylecow-plugin-nested-rules'))
	.use(require('stylecow-plugin-color'))

	//custom tasks
	.addTask({
		filter: {
			type: 'Keyword',
			name: 'grey'
		},
		fn: keyword => keyword.name = 'gray'
	});

//Create a Coder instance to minify the css code
let coder = new stylecow.Coder('minify');

//Parse a css file
let css = stylecow.parseFile('styles.css');

//Execute the tasks
tasks.run(css);

//Get the minified code
let code = coder.run(css);

console.log(code.css);
```
