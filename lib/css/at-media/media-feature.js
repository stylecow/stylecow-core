(function (stylecow) {

	stylecow.MediaFeature = function (name) {
		this.class = 'MediaFeature';
		this.type = 'MediaFeature';
		this.setFullName(name);
	};

	stylecow.MediaFeature.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.OPEN_PARENTHESIS) {
			reader.next(true);

			if (reader.currToken[0] !== t.NAME) {
				return reader.error();
			}

			var element = new stylecow.MediaFeature(reader.currToken[3]);
			
			reader.next(true);

			if (reader.currToken[0] === t.COLON) {
				reader.next(true);

				element.push(stylecow.Unit.create(reader)
					|| stylecow.Keyword.create(reader)
					|| stylecow.Number.create(reader)
					|| reader.error());
			}

			reader.skipWhitespace();

			if (reader.currToken[0] !== t.CLOSE_PARENTHESIS) {
				return reader.error();
			}

			reader.next();

			return element;
		}
	};

	stylecow.MediaFeature.prototype = Object.create(stylecow.Keyword.prototype, {
		toString: {
			value: function () {
				var string = (this.vendor ? '-' + this.vendor + '-' : '') + this.name;

				if (this.length) {
					string += ': ' + this.join(' ');
				}

				return '(' + string + ')';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../../index'));
