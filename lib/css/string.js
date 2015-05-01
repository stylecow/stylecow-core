(function (stylecow) {

	stylecow.String = function () {
		this.class = 'String';
		this.type = 'String';
		this.data = {};
	};

	stylecow.String.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.STRING) {
			return (new stylecow.String())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	};

	stylecow.String.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return '"' + this.name.replace(/(["\\])/g, '\\$1') + '"';
			}
		},

		toCode: {
			value: function (code) {
				var q = code.style['string-quotes'];

				code.append(q + this.name.replace(new RegExp('([' + q + '\\\\])', 'g'), '\\$1') + q, this);
			}
		}
	});
})(require('../index'));
