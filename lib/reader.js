(function (stylecow) {
    stylecow.Reader = function (tokens) {
        this.tokens = [];

        var token;

        do {
            token = tokens.get();
            this.tokens.push(token);
        } while (token[0] !== 0);

        this.pos = 0;

        this.currToken = this.tokens[this.pos];
        this.nextToken = this.tokens[++this.pos];

        //skip whitespaces
        if (this.currToken[0] === 1) {
            this.move();
        }
    };

    stylecow.Reader.prototype = {
        move: function () {
            this.currToken = this.nextToken;
            this.nextToken = this.tokens[++this.pos];

            //skip whitespaces
            if (this.currToken[0] === 1) {
                this.move();
            }

            return (this.currToken[0] !== 0);
        },
        get: function (offset) {
            return this.tokens[this.pos + offset] || [];
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
        string: function (offset) {
            return tokenToString(offset === undefined ? this.currToken : this.get(offset));
        },
        error: function () {
            throw new Error('Parser error! Unespected "'
                + tokenToString(this.currToken)
                + tokenToString(this.nextToken)
                + '" in:'
                + '\nline: ' + this.currToken[1]
                + '\ncol: ' + this.currToken[2]
                + '\n'
            );
        }
    };

    function tokenToString (token) {
        if (!token) {
            return '';
        }

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
            null,
            null,
            '!',
            '&',
            '/',
            '^',
            null
        ][token[0]] || token[3];
    }
})(require('./index'));
