import { join } from "https://deno.land/std/path/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { cssError, parseFile } from "../lib/index.js";

class TestCase {
  constructor(cwd, name, cssErrors) {
    this.cwd = cwd;
    this.name = name;

    try {
      this.css = parseFile(this.path("input.css"));
    } catch (error) {
      if (cssErrors) {
        this.css = cssError(error);
      } else {
        throw error;
      }
    }
  }

  path(file) {
    return join(this.cwd, this.name, file);
  }

  readJson(file) {
    file = this.path(file);

    if (existsSync(file)) {
      return JSON.parse(Deno.readTextFileSync(file));
    }
  }

  writeJson(file, content) {
    file = this.path(file);
    Deno.writeTextFileSync(file, JSON.stringify(content, undefined, "  "));
  }

  read(file) {
    file = this.path(file);

    if (!existsSync(file)) {
      return "";
    }

    return this.normalize(Deno.readTextFileSync(file));
  }

  normalize(src) {
    // normalize line endings
    src = src.replace(/\r\n/, "\n");

    // remove trailing newline
    src = src.replace(/\n$/, "");

    return src;
  }

  write(file, content) {
    Deno.writeTextFileSync(this.path(file), content);
  }

  assertString(expect) {
    assertEquals(this.css.toString(), this.read(expect || "output.css"));
  }

  writeString(output) {
    this.write(output || "output.css", this.css.toString());
  }

  assertAst(expect) {
    assertEquals(this.css.toAst(), this.readJson(expect || "ast.json"));
  }

  writeAst(output) {
    this.writeJson(output || "ast.json", this.css.toAst());
  }
}

export default class Test {
  constructor(cwd) {
    this.errors = false;
    this.directory(cwd);
  }

  cssErrors(enabled) {
    this.errors = enabled ? true : false;

    return this;
  }

  directory(cwd) {
    this.cwd = cwd;

    return this;
  }

  filter(cases) {
    if (typeof cases === "string") {
      cases = [cases];
    }

    this.cases = cases;

    return this;
  }

  ignore(cases) {
    if (typeof cases === "string") {
      cases = [cases];
    }

    this.ignored = cases;

    return this;
  }

  run(callback) {
    const cases = this.cases || [];

    if (!cases.length) {
      for (const entry of Deno.readDirSync(this.cwd)) {
        cases.push(entry.name);
      }
    }

    const ignore = this.ignored || [];

    cases.forEach((name) => {
      if (name[0] === "." || ignore.indexOf(name) !== -1) {
        return;
      }

      callback(new TestCase(this.cwd, name, this.errors));
    });
  }
}
