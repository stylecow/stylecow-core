(function (stylecow) {

	stylecow.Selector = function () {};

	stylecow.Selector.createFromString = function (string) {
		return stylecow.Selector.create(new stylecow.Reader(string));
	};

	stylecow.Selector.create = function (reader) {
		var element = reader.setData(new stylecow.Selector());

        reader.addBreakChar(',');

		reader.execute(function () {
			if (reader.isCombinator()) {
				return element.push(stylecow.Combinator.create(reader));
			}

			if (element.length && (reader.prevChar === ' ') && (element[element.length - 1].type !== 'Combinator' || element[element.length - 1].name === '&')) {
				var combinator = reader.setData(new stylecow.Combinator);
				combinator.name = ' ';
				element.push(combinator);
			}

			if (reader.isComment()) {
				return element.push(stylecow.Comment.create(reader));
			}

			if (reader.isFunction()) {
				return element.push(stylecow.Function.create(reader));
			}

			var buffer = reader.currChar;

			while (reader.next()
				&& !reader.isCombinator()
				&& (reader.breakChars[0].indexOf(reader.currChar) === -1)
				&& (['.', '#', '['].indexOf(reader.currChar) === -1)
				&& (reader.currChar !== ':' || reader.prevChar === ':')
			) {
				buffer += reader.currChar;
			}

			var keyword = reader.setData(new stylecow.Keyword);
			keyword.name = buffer;

			element.push(keyword);
		});

		return element;
	};

	stylecow.Selector.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Selector'
		},

		toString: {
			value: function () {
				return this.join('');
			}
		},

		toCode: {
			value: function (code) {
				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(' ');
					}
				});
			}
		}
	});
})(require('../index'));
