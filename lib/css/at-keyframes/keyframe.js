(function (stylecow) {

	stylecow.Keyframe = function () {
		this.class = 'Keyframe';
		this.type = 'Keyframe';
	};

	stylecow.Keyframe.create = function (reader) {
		var element = (new stylecow.Keyframe()).setSource(reader);

		element.push(stylecow.KeyframeSelectors.create(reader) || reader.error());
		element.push(stylecow.DeclarationBlock.create(reader) || reader.error());

		return element;
	};

	stylecow.Keyframe.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return this.join(' ');
			}
		}
	});
})(require('../../index'));
