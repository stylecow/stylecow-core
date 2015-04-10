(function (stylecow) {

	stylecow.MatchCombinator = function () {
		this.class = 'Combinator';
		this.type = 'Combinator';
	};

	stylecow.MatchCombinator.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.EQUALS) {
			reader.move();

			return (new stylecow.MatchCombinator)
				.setSource(reader)
				.set('name', '=');
		}

		if (reader.nextToken[0] === t.EQUALS) {
			if (reader.currToken[0] === t.TILDE) {
				var element = (new stylecow.MatchCombinator)
					.setSource(reader)
					.set('name', '~=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.VERTICAL_LINE) {
				var element = (new stylecow.MatchCombinator)
					.setSource(reader)
					.set('name', '|=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.CARET) {
				var element = (new stylecow.MatchCombinator)
					.setSource(reader)
					.set('name', '^=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.DOLLAR) {
				var element = (new stylecow.MatchCombinator)
					.setSource(reader)
					.set('name', '$=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.ASTERISK) {
				var element = (new stylecow.MatchCombinator)
					.setSource(reader)
					.set('name', '*=');

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
				code.appendStyle('match-combinator-before');
				code.append(this.name);
				code.appendStyle('match-combinator-after');
			}
		}
	});
})(require('../../index'));
