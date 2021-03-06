import { equal } from "https://deno.land/std/testing/asserts.ts";
import { Test, Coder } from "../mod.js";

var test = new Test(Deno.cwd() + "/tests/tests");
var normal = new Coder();
var minifier = new Coder("minify");

test.run(function (test) {
  Deno.test(`tests/${test.name}: should match output.css`, function () {
    //test.writeString()
    test.assertString();
  });

  var normalCode = normal.run(test.css);
  var minifyCode = minifier.run(test.css, "output.min.css");

  Deno.test(`tests/${test.name}: should match output.normal.css`, function () {
    //test.write('output.normal.css', normalCode.css);
    equal(test.normalize(normalCode.css), test.read("output.normal.css"));
  });

  Deno.test(`tests/${test.name}: should match output.min.css`, function () {
    //test.write('output.min.css', minifyCode.css);
    equal(test.normalize(minifyCode.css), test.read("output.min.css"));
  });
});
