(function (stylecow) {

	stylecow.Unit = function (name) {
		this.class = 'Unit';
		this.type = 'Unit';
		this.name = name;
	};

	stylecow.Unit.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NUMBER) {
			if (reader.nextToken[0] === t.NAME) {
				var element = new stylecow.Unit(reader.nextToken[3]);
				element.push(stylecow.Number.create(reader) || reader.error());
				reader.move();

				return element;
			}

			if (reader.nextToken[0] === t.PERCENTAGE) {
				var element = new stylecow.Unit('%');
				element.push(stylecow.Number.create(reader) || reader.error());
				reader.move();

				return element;
			}
		}
	};

	stylecow.Unit.prototype = Object.create(stylecow.prototypes.NodeCollectionWithName, {
		toString: {
			value: function () {
				return this.join('') + this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
