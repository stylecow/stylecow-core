(function (stylecow) {

	stylecow.ClassSelector = function () {
		this.class = 'ClassSelector';
		this.type = 'ClassSelector';
	};

	stylecow.ClassSelector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.STOP && reader.nextToken[0] === t.NAME) {
			reader.move();

			return (new stylecow.ClassSelector())
				.setSource(reader)
				.set('name', reader.getAndMove()[3]);
		}
	};

	stylecow.ClassSelector.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return '.' + this.name;
			}
		}
	});
})(require('../../index'));
