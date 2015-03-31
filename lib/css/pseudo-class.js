(function (stylecow) {

	stylecow.PseudoClass = function (name) {
		this.class = 'PseudoClass';
		this.type = 'PseudoClass';
		this.setFullName(name);
	};

	stylecow.PseudoClass.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME) {
			var element = new stylecow.PseudoClass(reader.nextToken[3]);
			reader.next();
			reader.next();

			return element;
		}
	};

	stylecow.PseudoClass.prototype = Object.create(stylecow.Keyword.prototype, {
		toString: {
			value: function () {
				if (this.vendor) {
					return ':-' + this.vendor + '-' + this.name;
				}

				return ':' + this.name;
			}
		}
	});
})(require('../index'));
