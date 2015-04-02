(function (stylecow) {

	stylecow.IdSelector = function (name) {
		this.class = 'IdSelector';
		this.type = 'IdSelector';
		this.name = name;
	};

	stylecow.IdSelector.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.HASH && reader.nextToken[0] === t.NAME) {
			var element = new stylecow.IdSelector(reader.nextToken[3]);
			reader.next();
			reader.next();

			return element;
		}
	};

	stylecow.IdSelector.prototype = Object.create(stylecow.TypeSelector.prototype, {
		toString: {
			value: function () {
				return '#' + this.name;
			}
		}
	});
})(require('../../index'));
