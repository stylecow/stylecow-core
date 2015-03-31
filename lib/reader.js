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
        next: function () {
            if (this.nextToken === undefined) {
                return false;
            }

            this.currToken = this.nextToken;
            this.nextToken = this.tokens.tokens[++this.pos];

            return this.currToken;
        }
    };
})(require('./index'));
