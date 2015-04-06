(function (stylecow) {

	stylecow.Unit = function (value, name) {
		this.class = 'Unit';
		this.type = 'Unit';
		this.value = value;
		this.name = name;
	};

	stylecow.Unit.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NUMBER) {
			if (reader.nextToken[0] === t.NAME) {
				return new stylecow.Unit(reader.getAndMove()[3], reader.getAndMove()[3]);
			}

			if (reader.nextToken[0] === t.PERCENTAGE) {
				var element = new stylecow.Unit(reader.getAndMove()[3], '%');
				reader.move();

				return element;
			}
		}
	};

	stylecow.Unit.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.value + this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
