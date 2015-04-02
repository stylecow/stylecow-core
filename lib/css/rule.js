(function (stylecow) {

	stylecow.Rule = function () {
		this.class = 'Rule';
		this.type = 'Rule';
	};

	stylecow.Rule.create = function (reader) {
		var element = new stylecow.Rule();

		element.push(stylecow.Selectors.create(reader) || reader.error());
		element.push(stylecow.Block.create(reader) || reader.error());

		return element;
	};

	stylecow.Rule.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child, k) {
					child.toCode(code);
				});
			}
		}
	});

})(require('../index'));
