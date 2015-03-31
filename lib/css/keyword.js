(function (stylecow) {

	stylecow.Keyword = function (name) {
		this.class = 'Keyword';
		this.type = 'Keyword';
		this.setFullName(name);
	};

	stylecow.Keyword.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.NAME) {
			var element = new stylecow.Keyword(reader.currToken[3]);
			reader.next();
			return element;
		}
	};

	stylecow.Keyword.prototype = Object.create(stylecow.Base, {
		setFullName: {
			value: function (name) {
				if (name[0] === '-') {
					var match = name.match(/^(-(\w+)-)?(.+)$/);
					this.vendor = match[2];
					this.name = match[3];
				} else {
					this.vendor = undefined;
					this.name = name;
				}
			}
		},

		toString: {
			value: function () {
				if (this.vendor) {
					return '-' + this.vendor + '-' + this.name;
				}

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
