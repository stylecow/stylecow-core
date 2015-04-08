(function (stylecow) {

	stylecow.Combinator = function () {
		this.class = 'Combinator';
		this.type = 'Combinator';
	};

	stylecow.Combinator.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.PLUS) {
			reader.move();

			return (new stylecow.Combinator())
				.setSource(reader)
				.set('name', '+');
		}

		if (reader.currToken[0] === t.GREATER_THAN) {
			reader.move();

			return (new stylecow.Combinator())
				.setSource(reader)
				.set('name', '>');
		}

		if (reader.currToken[0] === t.TILDE) {
			reader.move();

			return (new stylecow.Combinator())
				.setSource(reader)
				.set('name', '~');
		}

		if (reader.currToken[0] === t.AMPERSAND) {
			reader.move();

			return (new stylecow.Combinator())
				.setSource(reader)
				.set('name', '&');
		}
		
		if (reader.get(-2)[0] === t.WHITESPACE) {
			return (new stylecow.Combinator())
				.setSource(reader)
				.set('name', ' ');
		}
	};

	stylecow.Combinator.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				if (this.name === ' ' || this.name === '&') {
					return this.name;
				}

				return ' ' + this.name + ' ';
			}
		}
	});
})(require('../../index'));
