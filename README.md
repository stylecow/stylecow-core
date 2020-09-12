# Stylecow core

Fast and furious css processor. For Deno

Simple usage example:

```javascript
import { Task, Coder, parseFile } from 'stylecow-core/mod.js';

import prefixes from 'stylecow-plugin-prefixes/mod.js';
import nestedRules from 'stylecow-plugin-nested-rules/mod.js';
import color from 'stylecow-plugin-color/mod.js';

//Create a Tasks instance and add some stuff
const tasks = new Tasks()

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
	.use(prefixes)
	.use(nestedRules)
	.use(color)

	//custom tasks
	.addTask({
		filter: {
			type: 'Keyword',
			name: 'grey'
		},
		fn: keyword => keyword.name = 'gray'
	});

//Create a Coder instance to minify the css code
const coder = new Coder('minify');

//Parse a css file
const css = parseFile('styles.css');

//Execute the tasks
tasks.run(css);

//Get the minified code
const code = coder.run(css);

console.log(code.css);
```
