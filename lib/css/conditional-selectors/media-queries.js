(function (stylecow) {

	stylecow.MediaQueries = function () {
		this.class = 'MediaQueries';
		this.type = 'MediaQueries';
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
		}
	});
})(require('../../index'));
