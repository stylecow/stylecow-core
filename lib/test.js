"use strict";

let path   = require('path');
let fs     = require('fs');
let assert = require('assert');

const stylecow = require('./index');

class TestCase {
	constructor(cwd, name) {
		this.cwd = cwd;
		this.name = name;
        this.css = stylecow.parseFile(this.path('input.css'));
	}

	path (file) {
        return path.join(this.cwd, this.name, file);
    }

    readJson (file) {
        file = this.path(file);

        if (fs.existsSync(file)) {
            return require(file);
        }
    }

    writeJson (file, content) {
        file = this.path(file);
        fs.writeFileSync(file, JSON.stringify(content, undefined, '  '));
    }

    read (file) {
        file = this.path(file);

        if (!fs.existsSync(file)) {
            return '';
        }

        return this.normalize(fs.readFileSync(file, 'utf8'));
    }

    normalize (src) {
        // normalize line endings
        src = src.replace(/\r\n/, '\n');

        // remove trailing newline
        src = src.replace(/\n$/, '');

        return src;
    }

    write (file, content) {
        fs.writeFileSync(this.path(file), content);
    }

    assertString (expect) {
        assert.equal(this.css.toString(), this.read(expect || 'output.css'));
    }

    writeString (output) {
        this.write(output || 'output.css', this.css.toString());
    }

    assertAst (expect) {
        assert.deepEqual(this.css.toAst(), this.readJson(expect || 'ast.json'));
    }

    writeAst (output) {
        this.writeJson(output || 'ast.json', this.css.toAst());
    }
}

stylecow.Test = class {
    constructor(cwd) {
        this.directory(cwd);
    }

    directory(cwd) {
        this.cwd = cwd;

        return this;
    }

    filter(cases) {
        if (typeof cases === 'string') {
            cases = [cases];
        }

        this.cases = cases;

        return this;
    }

    run(callback) {
        let self = this;
        let cases = this.cases || fs.readdirSync(this.cwd);

        cases.forEach(function(name) {
            if (name[0] === '.') {
                return;
            }

            callback(new TestCase(self.cwd, name));
        });
    }
}