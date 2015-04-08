(function (stylecow) {

	stylecow.Import = function () {
		this.class = 'Import';
		this.type = 'AtRule';
		this.name = 'import';
	};

	stylecow.Import.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'import') {
			var element = new stylecow.Import();
			reader.move();
			reader.move();

			element.push(stylecow.Url.create(reader, true) || reader.error());

			if (reader.currToken[0] === t.NAME) {
				element.push(stylecow.MediaQueries.create(reader) || reader.error());
			}

			reader.skip(t.SEMICOLON);

			return element;
		}
	};

	stylecow.Import.prototype = Object.create(stylecow.prototypes.NodeCollectionWithName, {
		toString: {
			value: function () {
				return '@' + this.name + ' ' + this.join(' ') + ';';
			}
		}
	});
})(require('../../index'));
