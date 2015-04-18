(function (stylecow) {

	stylecow.Function = function () {
		this.class = 'Function';
		this.type = 'Function';
		this.data = {};
	};

	stylecow.Function.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME && reader.nextToken[0] === t.OPEN_PARENTHESIS) {
			var element = (new stylecow.Function())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

			reader.move();

			do {
				element.push(stylecow.Value.create(reader) || reader.error());

			} while (reader.currToken[0] === t.COMMA && reader.move());

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	};

	stylecow.Function.createUrl = function (reader, fromString, names) {
		var t = stylecow.Tokens;

		names = names || ['url'];

		//url()
		if (reader.currToken[0] === t.NAME && reader.nextToken[0] === t.OPEN_PARENTHESIS && (names.indexOf(reader.currToken[3]) !== -1)) {
			var element = (new stylecow.Function())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);

			reader.move();


			// url("address")
			if (reader.currToken[0] === t.STRING) {
				element.push(stylecow.String.create(reader) || reader.error());
			
			// url(address)
			} else if (reader.currToken[0] !== t.CLOSE_PARENTHESIS) {
				var url = (new stylecow.String())
					.setSource(reader)
					.setName('');

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
				.setName('url');

			element.push(stylecow.String.create(reader) || reader.error());

			return element;
		}
	};

	stylecow.Function.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				return this.getNameWithVendor() + '(' + this.join(', ') + ')';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.getNameWithVendor() + '(', this);
				code.appendStyle('function-opening-parenthesis-after');

				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.appendStyle('function-comma-before');
						code.append(',');
						code.appendStyle('function-comma-after');
					}
				});

				code.appendStyle('function-closing-parenthesis-before');
				code.append(')');
			}
		}
	});
})(require('../index'));
