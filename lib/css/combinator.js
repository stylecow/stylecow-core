(function (stylecow) {

	stylecow.Combinator = function () {};

	stylecow.Combinator.createFromString = function (string) {
		return stylecow.Combinator.create(new stylecow.Reader(string));
	};

	stylecow.Combinator.create = function (reader) {
		var element = reader.setData(new stylecow.Combinator());

		while (reader.isCombinator()) {
			if (reader.currChar !== ' ') {
				element.name = reader.currChar;
			}

			reader.next();

			if (reader.currChar === '&') {
				break;
			}
		}

		element.name = element.name || ' ';

		return element;
	};

	stylecow.Combinator.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Combinator'
		},

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
