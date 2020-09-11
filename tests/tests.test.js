import { equal } from "https://deno.land/std/testing/asserts.ts";
import Test from "../lib/test.js";
import Coder from "../lib/coder.js";

var test = new Test(Deno.cwd() + "/tests/tests");
var normal = new Coder();
var minifier = new Coder("minify");

test.run(function (test) {
  describe("tests/" + test.name, function () {
    this.timeout(6000);

    it("should match output.css", function () {
      //test.writeString()
      test.assertString();
    });

    var normalCode = normal.run(test.css);
    var minifyCode = minifier.run(test.css, "output.min.css");

    it("should match output.normal.css", function () {
      //test.write('output.normal.css', normalCode.css);
      equal(test.normalize(normalCode.css), test.read("output.normal.css"));
    });

    it("should match output.min.css", function () {
      //test.write('output.min.css', minifyCode.css);
      equal(test.normalize(minifyCode.css), test.read("output.min.css"));
    });

    it("should match output.min.map", function () {
      //test.write('output.min.map', minifyCode.map);
      equal(test.normalize(minifyCode.map), test.read("output.min.map"));
    });
  });
});
