(function (stylecow) {

	stylecow.Combinator = function () {
		this.class = 'Combinator';
		this.type = 'Combinator';
		this.data = {};
	};

	stylecow.Combinator.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.PLUS) {
			reader.move();

			return (new stylecow.Combinator())
				.setSource(reader)
				.setName('+');
		}

		if (reader.currToken[0] === t.GREATER_THAN) {
			reader.move();

			return (new stylecow.Combinator())
				.setSource(reader)
				.setName('>');
		}

		if (reader.currToken[0] === t.TILDE) {
			reader.move();

			return (new stylecow.Combinator())
				.setSource(reader)
				.setName('~');
		}

		if (reader.get(-2)[0] === t.WHITESPACE) {
			return (new stylecow.Combinator())
				.setSource(reader)
				.setName(' ');
		}
	};

	stylecow.Combinator.createJoinCombinator = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AMPERSAND) {
			reader.move();

			return (new stylecow.Combinator())
				.setSource(reader)
				.setName('&');
		}
	};

	stylecow.Combinator.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				if (this.name === ' ' || this.name === '&') {
					return this.name;
				}

				if (this.index() === 0) {
					return this.name + ' ';
				}

				return ' ' + this.name + ' ';
			}
		},

		toCode: {
			value: function (code) {
				if (this.name === ' ' || this.name === '&') {
					return code.append(this.name);
				}

				if (this.index() !== 0) {
					code.appendStyle('selector-combinator-before');
				}

				code.append(this.name);
				code.appendStyle('selector-combinator-after');
			}
		}
	});
})(require('../../index'));
