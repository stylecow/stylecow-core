const EOF        = Symbol.for('EOF');
const WHITESPACE = Symbol.for('WHITESPACE');

(function (stylecow) {
    stylecow.Reader = function (tokens, file) {
        this.file = file;
        this.tokens = [];

        var token;

        do {
            token = tokens.get();
            this.tokens.push(token);
        } while (token[0] !== EOF);

        this.pos = 0;

        this.curr = this.tokens[this.pos];
        this.currToken = this.curr[0];
        this.currStr = this.curr[3];

        this.next = this.tokens[++this.pos];
        this.nextToken = this.next[0];
        this.nextStr = this.next[3];

        //skip whitespaces
        if (this.currToken === WHITESPACE) {
            this.move();
        }
    };

    stylecow.Reader.prototype = {
        move: function () {
            this.curr = this.next;
            this.currToken = this.curr[0];
            this.currStr = this.curr[3];

            this.next = this.tokens[++this.pos] || [];
            this.nextToken = this.next[0];
            this.nextStr = this.next[3];

            //skip whitespaces
            if (this.currToken === WHITESPACE) {
                this.move();
            }

            return (this.currToken !== EOF);
        },
        get: function (offset) {
            return this.tokens[this.pos + offset] || [];
        },
        getNextToken: function () {
            if (this.nextToken && this.nextToken === WHITESPACE) {
                return this.tokens[this.pos + 1] || [];
            }

            return this.tokens[this.pos] || [];
        },
        getStringAndMove: function () {
            var str = this.currStr;
            this.move();
            return str;
        },
        skip: function (type) {
            if (this.currToken === type) {
                this.move();
                return true;
            }
        },
        skipAll: function (type) {
            while (this.currToken === type) {
                this.move();
            }
        },
        error: function () {
            throw new Error(`
Parser error! Unespected "${this.currStr}${this.nextStr}" in:
file: ${this.file}
line: ${this.currToken[1]}
col:  ${this.currToken[2]}`);
        }
    };
})(require('./index'));
