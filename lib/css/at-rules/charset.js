(function (stylecow) {

	stylecow.Charset = function () {
		this.class = 'Charset';
		this.type = 'AtRule';
		this.name = 'charset';
	};

	stylecow.Charset.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'charset') {
			var element = new stylecow.Charset();
			reader.move();
			reader.move();

			element.push(stylecow.String.create(reader) || reader.error());

			reader.skip(t.SEMICOLON);

			return element;
		}
	};

	stylecow.Charset.prototype = Object.create(stylecow.prototypes.NodeCollectionWithName, {
		toString: {
			value: function () {
				return '@' + this.name + ' ' + this.join(' ') + ';';
			}
		}
	});
})(require('../../index'));
