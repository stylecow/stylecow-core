(function (stylecow) {

	stylecow.MatchCombinator = function () {
		this.class = 'MatchCombinator';
		this.type = 'Combinator';
		this.data = {};
	};

	stylecow.MatchCombinator.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.EQUALS) {
			reader.move();

			return (new stylecow.MatchCombinator())
				.setSource(reader)
				.setName('=');
		}

		if (reader.nextToken[0] === t.EQUALS) {
			if (reader.currToken[0] === t.TILDE) {
				var element = (new stylecow.MatchCombinator())
					.setSource(reader)
					.setName('~=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.VERTICAL_LINE) {
				var element = (new stylecow.MatchCombinator())
					.setSource(reader)
					.setName('|=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.CARET) {
				var element = (new stylecow.MatchCombinator())
					.setSource(reader)
					.setName('^=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.DOLLAR) {
				var element = (new stylecow.MatchCombinator())
					.setSource(reader)
					.setName('$=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.ASTERISK) {
				var element = (new stylecow.MatchCombinator())
					.setSource(reader)
					.setName('*=');

				reader.move();
				reader.move();

				return element;
			}
		}

	};

	stylecow.MatchCombinator.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.name);
			}
		}
	});
})(require('../../index'));
