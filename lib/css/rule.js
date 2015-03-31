(function (stylecow) {

	stylecow.Rule = function () {
		this.class = 'Rule';
		this.type = 'Rule';
	};

	stylecow.Rule.create = function (reader) {
		var element = new stylecow.Rule();
		var child = stylecow.Selectors.create(reader);

		if (!child) {
			return stylecow.Error.fromToken(reader);
		}

		element.push(child);

		child = stylecow.Block.create(reader);

		if (!child) {
			return stylecow.Error.fromToken(reader);
		}

		element.push(child);

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
