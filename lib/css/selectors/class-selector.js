(function (stylecow) {

	stylecow.ClassSelector = function (name) {
		this.class = 'ClassSelector';
		this.type = 'ClassSelector';
		this.name = name;
	};

	stylecow.ClassSelector.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.STOP && reader.nextToken[0] === t.NAME) {
			var element = new stylecow.ClassSelector(reader.nextToken[3]);
			reader.next();
			reader.next();

			return element;
		}
	};

	stylecow.ClassSelector.prototype = Object.create(stylecow.TypeSelector.prototype, {
		toString: {
			value: function () {
				return '.' + this.name;
			}
		}
	});
})(require('../../index'));
