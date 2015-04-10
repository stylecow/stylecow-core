(function (stylecow) {

	stylecow.Keyframes = function () {
		this.class = 'Media';
		this.type = 'AtRule';
	};

	stylecow.Keyframes.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3].match(/^(-(\w+)-)?keyframes$/)) {
			reader.move();

			var element = (new stylecow.Keyframes())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

			element.push(stylecow.Keyword.create(reader) || reader.error());
			element.push(stylecow.Block.createKeyframesBlock(reader) || reader.error());

			return element;
		}
	};

	stylecow.Keyframes.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				return '@' + this.getNameWithVendor() + ' ' + this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				code.appendStyle('at-rule-before');
				code.append('@' + this.getNameWithVendor() + ' ', this);

				this.forEach(function (child, k) {
					child.toCode(code);
				});
				code.appendStyle('at-rule-after');
			}
		}
	});

})(require('../../index'));
