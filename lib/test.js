"use strict";

let path   = require('path');
let fs     = require('fs');
let assert = require('assert');

const stylecow = require('./index');

class TestCase {
	constructor(cwd, name, cssErrors) {
		this.cwd = cwd;
		this.name = name;

        try {
            this.css = stylecow.parseFile(this.path('input.css'));
        } catch (error) {
            if (cssErrors) {
                this.css = stylecow.cssError(error);
            } else {
                throw error;
            }
        }
	}

	path (file) {
        return path.join(this.cwd, this.name, file);
    }

    readJson (file) {
        file = this.path(file);

        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
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
        if (typeof cases === 'string') {
            cases = [cases];
        }

        this.cases = cases;

        return this;
    }

    ignore(cases) {
        if (typeof cases === 'string') {
            cases = [cases];
        }

        this.ignored = cases;

        return this;
    }

    run(callback) {
        let self = this;
        let cases = this.cases || fs.readdirSync(this.cwd);
        let ignore = this.ignored || [];

        cases.forEach(function(name) {
            if (name[0] === '.' || ignore.indexOf(name) !== -1) {
                return;
            }

            callback(new TestCase(self.cwd, name, self.errors));
        });
    }
}