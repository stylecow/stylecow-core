(function (stylecow) {

	stylecow.Document = function () {
		this.class = 'Document';
		this.type = 'AtRule';
		this.data = {};
	};

	stylecow.Document.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3].match(/^(-(\w+)-)?document$/)) {
			reader.move();

			var element = (new stylecow.Document())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

			do {
				reader.skipAll(t.COMMENT);

				element.push(
						stylecow.Function.createUrl(reader, false, ['url', 'url-prefix', 'domain'])
					 || stylecow.Function.create(reader)
					 || reader.error()
				);

				reader.skipAll(t.COMMENT);

			} while (reader.currToken[0] === t.COMMA && reader.move());

			element.push(stylecow.Block.create(reader) || reader.error());

			return element;
		}
	};

	stylecow.Document.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				return '@' + this.getNameWithVendor() + ' ' + this.getChildren('Function').join(', ') + ' ' + this.getChild('Block');
			}
		},

		toCode: {
			value: function (code) {
				code.appendStyle('at-rule-before');
				code.append('@' + this.getNameWithVendor() + ' ', this);

				var functions = this.getChildren('Function');

				if (functions.length) {
					var latest = functions.length - 1;

					functions.forEach(function (child, k) {
						child.toCode(code);

						if (k !== latest) {
							code.appendStyle('declaration-comma-before');
							code.append(',');
							code.appendStyle('declaration-comma-after');
						}
					});
				}

				this.getChild('Block').toCode(code);

				code.appendStyle('at-rule-after');
			}
		}
	});

})(require('../../index'));
