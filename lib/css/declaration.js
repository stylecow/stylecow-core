(function (stylecow) {

	stylecow.Declaration = function () {
		this.class = 'Declaration';
		this.type = 'Declaration';
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
			element.push(stylecow.Important.create(reader) || reader.error());
		}

		reader.skip(t.SEMICOLON);

		return element;
	};

	stylecow.Declaration.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				var string = this.getNameWithVendor() + ': ' + this.children('Value').join(', ');

				if (this.hasChild('Important')) {
					string += ' ' + this.child('Important');
				}

				return string + ';';
			}
		}
	});
})(require('../index'));
