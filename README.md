# Stylecow core

Fast and furious css processor. For Deno

Simple usage example:

```javascript
import { parseFile, Task, Coder } from 'https://deno.land/x/stylecow_core/mod.js';

import importPlugin from 'https://deno.land/x/stylecow_import/mod.js';
import nestedRulesPlugin from 'https://deno.land/x/stylecow_nested_rules/mod.js';

//Create a Tasks instance and add some plugins
const tasks = new Tasks()
  .use(importPlugin)
  .use(nestedRulesPlugin)

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
