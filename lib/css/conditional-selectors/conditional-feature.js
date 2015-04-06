(function (stylecow) {

	stylecow.ConditionalFeature = function (name) {
		this.class = 'ConditionalFeature';
		this.type = 'ConditionalFeature';
		this.setFullName(name);
	};

	stylecow.ConditionalFeature.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] !== t.NAME) {
			return reader.error();
		}

		var element = new stylecow.ConditionalFeature(reader.getAndMove()[3]);
			
		if (reader.currToken[0] === t.COLON) {
			reader.move();

			do {
				element.push(stylecow.Value.create(reader) || reader.error());
			} while (reader.currToken[0] === t.COMMA && reader.move());
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
