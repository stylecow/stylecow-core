(function (stylecow) {

	stylecow.ConditionalFeatureRange = function () {
		this.class = 'ConditionalFeatureRange';
		this.type = 'ConditionalFeatureRange';
		this.data = {};
	};

	stylecow.ConditionalFeatureRange.create = function (reader) {
		var t = stylecow.Tokens;
		var element = (new stylecow.ConditionalFeatureRange())
			.setSource(reader);

		do {
			element.push(
					stylecow.Keyword.create(reader)
				 || stylecow.Unit.create(reader)
				 || stylecow.Comparator.createRange(reader)
				 || reader.error()
			);
		} while (reader.currToken[0] !== t.CLOSE_PARENTHESIS && reader.currToken[0] !== t.EOF);

		return element;
	};

	stylecow.ConditionalFeatureRange.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child) {
					child.toCode(code);
				});
			}
		}
	});
})(require('../../index'));
