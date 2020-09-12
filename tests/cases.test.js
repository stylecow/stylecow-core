import { Test, Coder } from "../mod.js";
import { equal } from "https://deno.land/std/testing/asserts.ts";

var cases = new Test(Deno.cwd() + "/tests/cases");
var coder = new Coder();

cases.cssErrors(true).run(function (test) {
  Deno.test(`cases/${test.name}: should match output.css`, function () {
    //test.writeString()
    test.assertString();
  });

  var code = coder.run(test.css);
  Deno.test(`cases/${test.name}: should match output.normal.css`, function () {
    //test.write('output.normal.css', code.css);
    equal(test.normalize(code.css), test.read("output.normal.css"));
  });

  Deno.test(`cases/${test.name}: clone should match output.css`, function () {
    //test.write('output.css', test.css.toString());
    equal(test.css.clone().toString(), test.read("output.css"), "foo");
  });

  Deno.test(`cases/${test.name}: should match ast.json`, function () {
    //test.writeAst()
    test.assertAst();
  });
});
