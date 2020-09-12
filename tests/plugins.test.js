import Test from "../lib/test.js";
import Tasks from "../lib/tasks.js";

import urlToUri from "./plugins/url-to-uri.js";
import idToClass from "./plugins/id-to-class.js";

var test = (new Test(Deno.cwd() + "/tests/tests")).filter(["plus.google.com"]);
var tasks = (new Tasks())
  .use(urlToUri)
  .use(idToClass);

test.run(function (test) {
  tasks.run(test.css);

  Deno.test(`plugins/${test.name}: should match output.plugins.css`, function () {
    //test.writeString('output.plugins.css')
    test.assertString("output.plugins.css");
  });

  Deno.test(`plugins/${test.name}: should match ast.plugins.json`, function () {
    //test.writeString('ast.plugins.json')
    test.assertString("ast.plugins.json");
  });
});
