(function (stylecow) {

	stylecow.Combinator = function (name) {
		this.class = 'Combinator';
		this.type = 'Combinator';
		this.name = name;
	};

	stylecow.Combinator.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.PLUS) {
			reader.move();
			return new stylecow.Combinator('+');
		}

		if (reader.currToken[0] === t.GREATER_THAN) {
			reader.move();
			return new stylecow.Combinator('>');
		}

		if (reader.currToken[0] === t.TILDE) {
			reader.move();
			return new stylecow.Combinator('~');
		}

		if (reader.currToken[0] === t.AMPERSAND) {
			reader.move();
			return new stylecow.Combinator('&');
		}
		
		if (reader.get(-2)[0] === t.WHITESPACE) {
			return new stylecow.Combinator(' ');
		}
	};

	stylecow.Combinator.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				if (this.name === ' ' || this.name === '&') {
					return this.name;
				}

				return ' ' + this.name + ' ';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.name, this);
			}
		}
	});
})(require('../../index'));
