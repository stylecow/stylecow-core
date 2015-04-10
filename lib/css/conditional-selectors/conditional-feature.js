(function (stylecow) {

	stylecow.ConditionalFeature = function () {
		this.class = 'ConditionalFeature';
		this.type = 'ConditionalFeature';
	};

	stylecow.ConditionalFeature.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] !== t.NAME) {
			return reader.error();
		}

		var element = (new stylecow.ConditionalFeature())
			.setSource(reader)
			.setNameWithVendor(reader.getAndMove()[3]);
			
		if (reader.currToken[0] === t.COLON) {
			reader.move();

			do {
				element.push(stylecow.Value.create(reader) || reader.error());
			} while (reader.currToken[0] === t.COMMA && reader.move());
		}

		return element;
	};

	stylecow.ConditionalFeature.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				var string = this.getNameWithVendor();

				if (this.length) {
					string += ': ' + this.join(' ');
				}

				return string;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.getNameWithVendor(), this);

				if (this.length) {
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
		}
	});
})(require('../../index'));
