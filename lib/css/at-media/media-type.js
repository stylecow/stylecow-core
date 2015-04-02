(function (stylecow) {

	stylecow.MediaType = function (name) {
		this.class = 'MediaType';
		this.type = 'MediaType';
		this.name = name;
	};

	stylecow.MediaType.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.NAME) {
			var element = new stylecow.MediaType(reader.currToken[3]);
			reader.next();
			return element;
		}
	};

	stylecow.MediaType.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../../index'));
