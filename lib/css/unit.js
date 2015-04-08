(function (stylecow) {

	stylecow.Unit = function () {
		this.class = 'Unit';
		this.type = 'Unit';
	};

	stylecow.Unit.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NUMBER) {
			if (reader.nextToken[0] === t.NAME) {
				var element = (new stylecow.Unit()).set('name', reader.nextToken[3]);
			} else if (reader.nextToken[0] === t.PERCENTAGE) {
				var element = (new stylecow.Unit()).set('name', '%');
			} else {
				return;
			}

			element
				.setSource(reader)
				.push(stylecow.Number.create(reader) || reader.error());

			reader.move();

			return element;
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
