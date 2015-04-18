(function (stylecow) {

	stylecow.Declaration = function () {
		this.class = 'Declaration';
		this.type = 'Declaration';
		this.data = {};
	};

	stylecow.Declaration.create = function (reader) {
		var t = stylecow.Tokens;
		var element;

		if (reader.currToken[0] === t.NAME) {
			element = (new stylecow.Declaration())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

		} else if (reader.currToken[0] === t.ASTERISK && reader.nextToken[0] === t.NAME) { //ie
			reader.move();

			element = (new stylecow.Declaration())
				.setSource(reader)
				.setNameWithVendor('*' + reader.getAndMove()[3]);
		} else {
			return;
		}

		reader.skipAll(t.COMMENT);
		reader.skip(t.COLON) || reader.error();

		do {
			element.push(stylecow.Value.create(reader) || reader.error());

		} while (reader.currToken[0] === t.COMMA && reader.move());

		if (reader.currToken[0] === t.EXCLAMATION) {
			element.push(stylecow.Bang.create(reader) || reader.error());
		}

		reader.skip(t.SEMICOLON);

		return element;
	};

	stylecow.Declaration.createMsFilter = function (reader) {
		var t = stylecow.Tokens;
		var element;

		if (reader.currToken[0] === t.NAME) {
			if (reader.currToken[3] !== 'filter' && reader.currToken[3] !== '-ms-filter') {
				return;
			}

			if (reader.currToken[3] === 'filter') {
				//Search by "=" before ";" to detect if it's a ms filter
				var offset = 0;

				while (true) {
					var token = reader.get(offset++);

					if (token[0] === t.EQUALS) {
						break;
					}

					//is a declaration
					if (token[0] === t.SEMICOLON || token[0] === t.CLOSE_CURLY_BRACKET) {
						return;
					}

					//end of file
					if (token[0] === t.EOF) {
						return reader.error();
					}
				}
			}

			reader.move();
			reader.skipAll(t.COMMENT);
			reader.skip(t.COLON) || reader.error();

			var element = (new stylecow.Declaration())
				.setSource(reader)
				.setName('filter')
				.setVendor('ms');

			var value = (new stylecow.Value()).setSource(reader);
			element.push(value);

			if (reader.currToken[0] === t.NAME && reader.currToken[3] === 'none') {
				value.push(stylecow.Keyword.create(reader) || reader.error());
			} else {
				var filter = (new stylecow.String())
					.setName('')
					.setSource(reader);

				value.push(filter);

				do {
					if (reader.currToken[0] !== t.COMMENT) {
						filter.name += reader.string();
					}
				} while (reader.move() && reader.currToken[0] !== t.SEMICOLON && reader.currToken[0] !== t.CLOSE_CURLY_BRACKET);
			}
		};

		if (reader.currToken[0] === t.EXCLAMATION) {
			element.push(stylecow.Bang.create(reader) || reader.error());
		}

		reader.skip(t.SEMICOLON);

		return element;
	};

	stylecow.Declaration.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				var string = this.getNameWithVendor() + ': ' + this.getChildren('Value').join(', ');

				if (this.hasChild('Bang')) {
					string += ' ' + this.getChild('Bang');
				}

				return string + ';';
			}
		},

		toCode: {
			value: function (code) {
				code.appendStyle('declaration-before');
				code.append(this.getNameWithVendor(), this);
				code.appendStyle('declaration-colon-before');
				code.append(':');
				code.appendStyle('declaration-colon-after');

				var values = this.getChildren('Value');
				var latest = values.length - 1;

				values.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.appendStyle('declaration-comma-before');
						code.append(',');
						code.appendStyle('declaration-comma-after');
					}
				});

				if (this.hasChild('Bang')) {
					code.append(' ');
					this.getChild('Bang').toCode(code);
				}

				code.append(';');
				code.appendStyle('declaration-after');
			}
		}
	});
})(require('../index'));
