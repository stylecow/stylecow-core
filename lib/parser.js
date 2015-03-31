(function (stylecow) {
    stylecow.Parser = function (tokens, file) {
        this.file = file || '';
        this.tokens = tokens;
        this.pos = 0;
    };

    stylecow.Parser.prototype = {
        next: function () {
            return this.tokens[this.pos++];
        }
    };
})(require('./index'));
