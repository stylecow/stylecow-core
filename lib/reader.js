(function (stylecow) {
    stylecow.Reader = function (tokens) {
        this.tokens = tokens;
        this.pos = 0;
        this.currToken;
        this.nextToken = this.tokens.tokens[this.pos];

        this.next();
    };

    stylecow.Reader.fromString = function (string) {
        var tokens = new stylecow.Tokens(string);
        tokens.run();

        return new stylecow.Reader(tokens);
    };

    stylecow.Reader.prototype = {
        next: function (skipWhitespace) {
            if (this.nextToken === undefined) {
                return false;
            }

            this.currToken = this.nextToken;
            this.nextToken = this.tokens.tokens[++this.pos];

            if (skipWhitespace === true) {
                this.skipWhitespace();
            }

            return this.currToken;
        },
        skipWhitespace: function () {
            if (this.currToken[0] === stylecow.Tokens.WHITESPACE) {
                this.next();
            }
        }
    };
})(require('./index'));
