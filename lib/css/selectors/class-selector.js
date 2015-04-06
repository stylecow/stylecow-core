(function (stylecow) {

	stylecow.ClassSelector = function (name) {
		this.class = 'ClassSelector';
		this.type = 'ClassSelector';
		this.name = name;
	};

	stylecow.ClassSelector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.STOP && reader.nextToken[0] === t.NAME) {
			reader.move();

			return new stylecow.ClassSelector(reader.getAndMove()[3]);
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
