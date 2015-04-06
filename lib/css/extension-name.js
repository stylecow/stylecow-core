(function (stylecow) {

	stylecow.ExtensionName = function (name) {
		this.class = 'ExtensionName';
		this.type = 'ExtensionName';
		this.name = name;
	};

	stylecow.ExtensionName.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME && reader.currToken[3].substr(0, 2) === '--') {
			return new stylecow.ExtensionName(reader.getAndMove()[3]);
		}
	};

	stylecow.ExtensionName.prototype = Object.create(stylecow.Base, {
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
})(require('../index'));
