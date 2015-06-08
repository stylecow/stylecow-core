(function (stylecow) {

	stylecow.Comparator = function () {
		this.class = 'Comparator';
		this.type = 'Comparator';
		this.data = {};
	};

	stylecow.Comparator.createMatch = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.EQUALS) {
			reader.move();

			return (new stylecow.Comparator())
				.setSource(reader)
				.setName('=');
		}

		if (reader.nextToken[0] === t.EQUALS) {
			if (reader.currToken[0] === t.TILDE) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('~=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.VERTICAL_LINE) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('|=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.CARET) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('^=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.DOLLAR) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('$=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.ASTERISK) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('*=');

				reader.move();
				reader.move();

				return element;
			}
		}
	};

	stylecow.Comparator.createRange = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.EQUALS) {
			reader.move();

			return (new stylecow.Comparator())
				.setSource(reader)
				.setName('=');
		}

		if (reader.currToken[0] === t.LESS_THAN) {
			if (reader.nextToken[0] === t.EQUALS) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('<=');

				reader.move();
				reader.move();

				return element;
			} else {
				reader.move();

				return (new stylecow.Comparator())
					.setSource(reader)
					.setName('<');
			}
		}

		if (reader.currToken[0] === t.GREATER_THAN) {
			if (reader.nextToken[0] === t.EQUALS) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('>=');

				reader.move();
				reader.move();

				return element;
			} else {
				reader.move();

				return (new stylecow.Comparator())
					.setSource(reader)
					.setName('>');
			}
		}
	};

	stylecow.Comparator.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.appendStyle('comparator-before');
				code.append(this.name);
				code.appendStyle('comparator-after');
			}
		}
	});
})(require('../index'));
