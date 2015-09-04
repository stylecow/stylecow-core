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

        this.currToken = this.tokens[this.pos];
        this.nextToken = this.tokens[++this.pos];

        //skip whitespaces
        if (this.currToken[0] === WHITESPACE) {
            this.move();
        }
    };

    stylecow.Reader.prototype = {
        move: function () {
            this.currToken = this.nextToken;
            this.nextToken = this.tokens[++this.pos];

            //skip whitespaces
            if (this.currToken[0] === WHITESPACE) {
                this.move();
            }

            return (this.currToken[0] !== EOF);
        },
        get: function (offset) {
            return this.tokens[this.pos + offset] || [];
        },
        getNextToken: function () {
            if (this.nextToken && this.nextToken[0] === WHITESPACE) {
                return this.tokens[this.pos + 1] || [];
            }

            return this.nextToken || [];
        },
        getAndMove: function () {
            var token = this.currToken;
            this.move();
            return token;
        },
        skip: function (type) {
            if (this.currToken[0] === type) {
                this.move();
                return true;
            }
        },
        skipAll: function (type) {
            while (this.currToken[0] === type) {
                this.move();
            }
        },
        error: function () {
            throw new Error(`
Parser error! Unespected "${this.currToken}${this.nextToken}" in:
file: ${this.file}
line: ${this.currToken[1]}
col:  ${this.currToken[2]}`);
        }
    };
})(require('./index'));
