(function (stylecow) {

	stylecow.Url = function () {
		this.class = 'Url';
		this.type = 'Url';
	};

	stylecow.Url.create = function (reader, fromString) {
		var t = stylecow.Tokens;

		//url()
		if (reader.currToken[0] === t.NAME && reader.currToken[3] === 'url' && reader.nextToken[0] === t.OPEN_PARENTHESIS) {
			reader.move();
			reader.move();

			var element = (new stylecow.Url()).setSource(reader);
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

			element.name = url;

			return element;
		}

		//"address"
		if (fromString && reader.currToken[0] === t.STRING) {
			return (new stylecow.Url())
				.setSource(reader)
				.set('name', reader.getAndMove()[3]);
		}
	};

	stylecow.Url.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return 'url("' + this.name + '")';
			}
		}
	});
})(require('../index'));
