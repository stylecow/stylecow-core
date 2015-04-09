(function (stylecow) {

	stylecow.Function = function () {
		this.class = 'Function';
		this.type = 'Function';
	};

	stylecow.Function.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME && reader.nextToken[0] === t.OPEN_PARENTHESIS) {
			var element = (new stylecow.Function())
				.setSource(reader)
				.set('name', reader.getAndMove()[3]);

			reader.move();

			do {
				element.push(stylecow.Value.create(reader) || reader.error());

			} while (reader.currToken[0] === t.COMMA && reader.move());

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	};

	stylecow.Function.createUrl = function (reader, fromString) {
		var t = stylecow.Tokens;

		//url()
		if (reader.currToken[0] === t.NAME && reader.currToken[3] === 'url' && reader.nextToken[0] === t.OPEN_PARENTHESIS) {
			var element = (new stylecow.Function())
				.setSource(reader)
				.set('name', reader.getAndMove()[3]);

			reader.move();


			// url("address")
			if (reader.currToken[0] === t.STRING) {
				element.push(stylecow.String.create(reader) || reader.error());
			
			// url(address)
			} else {
				var url = (new stylecow.String())
					.setSource(reader)
					.set('name', '');

				do {
					url.name += reader.string();

				} while (reader.move() && reader.currToken[0] !== t.CLOSE_PARENTHESIS);

				element.push(url);
			}

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}

		//"address"
		if (fromString && reader.currToken[0] === t.STRING) {
			var element = (new stylecow.Function())
				.setSource(reader)
				.set('name', 'url');

			element.push(stylecow.String.create(reader) || reader.error());

			return element;
		}
	};

	stylecow.Function.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				return this.getNameWithVendor() + '(' + this.join(', ') + ')';
			}
		}
	});
})(require('../index'));
