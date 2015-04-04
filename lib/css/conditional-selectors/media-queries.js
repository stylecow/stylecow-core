(function (stylecow) {

	stylecow.MediaQueries = function () {
		this.class = 'MediaQueries';
		this.type = 'MediaQueries';
	};

	stylecow.MediaQueries.create = function (reader) {
		var t = stylecow.Tokens;
		var element = new stylecow.MediaQueries();

		do {
			element.push(stylecow.MediaQuery.create(reader) || reader.error());
			reader.skipWhitespace();
		} while (reader.currToken[0] === t.COMMA && reader.next());

		return element;
	};

	stylecow.MediaQueries.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.join(', ');
			}
		},

		toCode: {
			value: function (code) {
				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(code.style.valueJoiner);
					}
				});
			}
		}
	});
})(require('../../index'));
