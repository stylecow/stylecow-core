(function (stylecow) {

	stylecow.ConditionalFeature = function () {
		this.class = 'ConditionalFeature';
		this.type = 'ConditionalFeature';
		this.data = {};
	};

	stylecow.ConditionalFeature.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME && reader.getNextToken()[0] === t.COLON) {
			var element = (new stylecow.ConditionalFeature())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

			reader.move();

			do {
				element.push(stylecow.Value.create(reader) || reader.error());
			} while (reader.currToken[0] === t.COMMA && reader.move());

			return element;
		}
	};

	stylecow.ConditionalFeature.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				return this.getNameWithVendor() + ': ' + this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.getNameWithVendor(), this);

				code.appendStyle('declaration-colon-before');
				code.append(':');
				code.appendStyle('declaration-colon-after');

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
})(require('../../index'));
