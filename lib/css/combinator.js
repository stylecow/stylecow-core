(function (stylecow) {

	stylecow.Combinator = function (name) {
		this.class = 'Combinator';
		this.type = 'Combinator';
		this.name = name;
	};

	stylecow.Combinator.create = function (reader) {
		var t = stylecow.Tokens;
		var space = false;
		var element;

		if (reader.currToken[0] === t.WHITESPACE) {
			space = true;
			reader.next();
		}

		if (reader.currToken[0] === t.PLUS) {
			element = new stylecow.Combinator('+');
			reader.next();
		} else if (reader.currToken[0] === t.GREATER_THAN) {
			element = new stylecow.Combinator('>');
			reader.next();
		} else if (reader.currToken[0] === t.TILDE) {
			element = new stylecow.Combinator('~');
			reader.next();
		} else if (reader.currToken[0] === t.AMPERSAND) {
			element = new stylecow.Combinator('&');
			reader.next();
		} else if (space) {
			element = new stylecow.Combinator(' ');
		} else {
			return;
		}

		if (reader.currToken[0] === t.WHITESPACE) {
			reader.next();
		}

		return element;
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
})(require('../index'));
