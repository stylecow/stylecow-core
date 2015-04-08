(function (stylecow) {

	stylecow.Root = function () {
		this.type = 'Root';
		this.class = 'Root';
	};

	stylecow.Root.create = function (reader) {
		var t = stylecow.Tokens;
		var element = (new stylecow.Root()).setSource(reader);

		while (reader.currToken[0] !== t.EOF) {
			element.push(
					stylecow.Charset.create(reader)
				 || stylecow.Comment.create(reader)
				 || stylecow.Import.create(reader)
				 || stylecow.Media.create(reader)
				 || stylecow.CustomMedia.create(reader)
				 || stylecow.Namespace.create(reader)
				 || stylecow.Supports.create(reader)
				 || stylecow.Keyframes.create(reader)
				 || stylecow.Document.create(reader)
				 || stylecow.AtRule.create(reader)
				 || stylecow.Rule.create(reader)
				 || reader.error()
			);
		}

		return element;
	};

	stylecow.Root.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return this.map(function (child) {
					return child.toString();
				}).filter(function (string) {
					return string ? true : false;
				}).join("\n");
			}
		}
	});
})(require('../index'));
