(function (stylecow) {

	stylecow.MediaQueries = function () {
		this.class = 'MediaQueries';
		this.type = 'MediaQueries';
		this.data = {};
	};

	stylecow.MediaQueries.create = function (reader) {
		var t = stylecow.Tokens;
		var element = (new stylecow.MediaQueries()).setSource(reader);

		do {
			element.push(stylecow.MediaQuery.create(reader) || reader.error());
		} while (reader.currToken[0] === t.COMMA && reader.move());

		return element;
	};

	stylecow.MediaQueries.prototype = Object.create(stylecow.prototypes.NodeCollection, {
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
						code.appendStyle('selector-comma-before');
						code.append(',');
						code.appendStyle('selector-comma-after');
					}
				});
			}
		}
	});
})(require('../../index'));
