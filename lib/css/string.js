(function (stylecow) {

	stylecow.String = function (name) {
		this.class = 'String';
		this.type = 'String';
		this.name = name;
	};

	stylecow.String.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.WHITESPACE) {
			reader.next();
		}

		if (reader.currToken[0] === t.STRING) {
			var element = new stylecow.String(reader.currToken[3]);
			reader.next();
			return element;
		}
	};

	stylecow.String.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return '"' + this.name.replace(/"/g, '\\"') + '"';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
