(function (stylecow) {

	stylecow.Document = function () {
		this.class = 'Document';
		this.type = 'AtRule';
	};

	stylecow.Document.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3].match(/^(-(\w+)-)?document$/)) {
			var element = (new stylecow.Document()).setSource(reader);
			reader.move();
			reader.move();

			element.push(stylecow.Value.create(reader) || reader.error());
			element.push(stylecow.Block.create(reader) || reader.error());

			return element;
		}
	};

	stylecow.Document.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				return '@' + this.getNameWithVendor() + ' ' + this.join(' ');
			}
		}
	});

})(require('../../index'));
