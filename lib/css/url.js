(function (stylecow) {

	stylecow.Url = function (name) {
		this.class = 'Url';
		this.type = 'Url';
		this.name = name;
	};

	stylecow.Url.create = function (reader) {
		var t = stylecow.Tokens;

		//url()
		if (reader.currToken[0] === t.NAME && reader.currToken[3] === 'url' && reader.nextToken[0] === t.OPEN_PARENTHESIS) {
			reader.move();
			reader.move();

			var url;

			// url("address")
			if (reader.currToken[0] === t.STRING) {
				url = reader.getAndMove()[3];
			
			// url(address)
			} else {
				url = '';

				do {
					url += reader.string();

				} while (reader.move() && reader.currToken[0] !== t.CLOSE_PARENTHESIS);
			}

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return new stylecow.Url(url);
		}

		//"address"
		if (reader.currToken[0] === t.STRING) {
			return new stylecow.Url(reader.getAndMove()[3]);
		}
	};

	stylecow.Url.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return 'url("' + this.name + '")';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
