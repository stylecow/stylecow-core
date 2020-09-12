# Stylecow core

Fast and furious css processor. For Deno

Simple usage example:

```javascript
import { parseFile, Task, Coder } from 'https://deno.land/x/stylecow_core/mod.js';

import prefixes from 'https://deno.land/x/stylecow_prefixes/mod.js';
import nestedRules from 'https://deno.land/x/stylecow_nested_rules/mod.js';
import color from 'https://deno.land/x/stylecow_color/mod.js';

//Create a Tasks instance and add some plugins
const tasks = new Tasks()
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
