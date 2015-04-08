(function (stylecow) {

	stylecow.MatchCombinator = function (name) {
		this.class = 'Combinator';
		this.type = 'Combinator';
		this.name = name;
	};

	stylecow.MatchCombinator.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.EQUALS) {
			reader.move();
			return new stylecow.MatchCombinator('=');
		}

		if (reader.nextToken[0] === t.EQUALS) {
			if (reader.currToken[0] === t.TILDE) {
				reader.move();
				reader.move();
				return new stylecow.Combinator('~=');
			}

			if (reader.currToken[0] === t.VERTICAL_LINE) {
				reader.move();
				reader.move();
				return new stylecow.Combinator('|=');
			}

			if (reader.currToken[0] === t.CARET) {
				reader.move();
				reader.move();
				return new stylecow.Combinator('^=');
			}

			if (reader.currToken[0] === t.DOLLAR) {
				reader.move();
				reader.move();
				return new stylecow.Combinator('$=');
			}

			if (reader.currToken[0] === t.ASTERISK) {
				reader.move();
				reader.move();
				return new stylecow.Combinator('*=');
			}
		}

	};

	stylecow.MatchCombinator.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return this.name;
			}
		}
	});
})(require('../../index'));
