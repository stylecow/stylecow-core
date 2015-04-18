(function (stylecow) {

	stylecow.Rule = function () {
		this.class = 'Rule';
		this.type = 'Rule';
		this.data = {};
	};

	stylecow.Rule.create = function (reader) {
		var element = (new stylecow.Rule()).setSource(reader);

		element.push(stylecow.Selectors.create(reader) || reader.error());
		element.push(stylecow.Block.create(reader) || reader.error());

		return element;
	};

	stylecow.Rule.createKeyframe = function (reader) {
		var element = (new stylecow.Rule()).setSource(reader);

		element.push(stylecow.Selectors.createKeyframeSelectors(reader) || reader.error());
		element.push(stylecow.Block.createDeclarationBlock(reader) || reader.error());

		return element;
	};

	stylecow.Rule.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				code.appendStyle('rule-before');

				this.forEach(function (child, k) {
					child.toCode(code);
				});

				code.appendStyle('rule-after');
			}
		}
	});

})(require('../index'));
