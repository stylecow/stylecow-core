(function (stylecow) {
    stylecow.Reader = function (tokens) {
        this.tokens = tokens;
        this.pos = 0;

        this.currToken      = this.tokens[this.pos];
        this.nextToken      = this.tokens[++this.pos];
    };

    stylecow.Reader.fromString = function (string) {
        return stylecow.Reader.fromTokens(new stylecow.Tokens(string));
    };

    stylecow.Reader.fromTokens = function (tokens) {
        var arr = [];
        var token;

        do {
            token = tokens.get();
            arr.push(token);
        } while (token[0] !== 0);

        return new stylecow.Reader(arr);
    };

    stylecow.Reader.prototype = {
        next: function (skipWhitespace) {
            this.currToken = this.nextToken;
            this.nextToken = this.tokens[++this.pos];

            if (skipWhitespace === true) {
                this.skipWhitespace();
            }

            return (this.currToken[0] !== 0);
        },
        skipWhitespace: function () {
            if (this.currToken[0] === 1) {
                this.next();
            }
        },
        get: function (offset) {
            return this.tokens[this.pos + offset];
        },
        string: function () {
            return tokenToString(this.currToken);
        },
        error: function () {
            throw new Error('Unespected token: '
                + tokenToString(this.currToken)
                + tokenToString(this.nextToken)
                + '\nline: ' + this.currToken[1]
                + '\ncol: ' + this.currToken[2]
                + '\n'
            );
        }
    };

    function tokenToString (token) {
        return [
            '<EOF>',
            '<SPACE>',
            ':',
            ';',
            ',',
            '[',
            ']',
            '{',
            '}',
            '(',
            ')',
            '@',
            '=',
            '$',
            '+',
            '-',
            '.',
            '<',
            '>',
            '*',
            '|',
            '~',
            null,
            null,
            '%',
            null,
            '#',
            null,
            '!',
            '&',
            '/',
            null
        ][token[0]] || token[3];
    }
})(require('./index'));
