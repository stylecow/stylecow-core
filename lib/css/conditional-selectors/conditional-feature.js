(function (stylecow) {

	stylecow.ConditionalFeature = function (name) {
		this.class = 'ConditionalFeature';
		this.type = 'ConditionalFeature';
		this.setFullName(name);
	};

	stylecow.ConditionalFeature.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] !== t.NAME) {
			return reader.error();
		}

		var element = new stylecow.ConditionalFeature(reader.currToken[3]);
			
		reader.next(true);

		if (reader.currToken[0] === t.COLON) {
			do {
				reader.next();
				element.push(stylecow.Value.create(reader) || reader.error());
				reader.skipWhitespace();

			} while (reader.currToken[0] === t.COMMA);
		}

		return element;
	};

	stylecow.ConditionalFeature.prototype = Object.create(stylecow.Keyword.prototype, {
		toString: {
			value: function () {
				var string = (this.vendor ? '-' + this.vendor + '-' : '') + this.name;

				if (this.length) {
					string += ': ' + this.join(' ');
				}

				return string;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../../index'));
