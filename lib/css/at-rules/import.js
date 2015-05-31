(function (stylecow) {

	stylecow.Import = function () {
		this.class = 'Import';
		this.type = 'AtRule';
		this.name = 'import';
		this.data = {};
	};

	stylecow.Import.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'import') {
			var element = (new stylecow.Import()).setSource(reader);
			reader.move();
			reader.move();

			element.push(stylecow.Function.createUrl(reader, true) || reader.error());

			if (reader.currToken[0] === t.NAME || reader.currToken[0] === t.OPEN_PARENTHESIS) {
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
		},

		toCode: {
			value: function (code) {
				code.appendStyle('at-rule-inline-before');
				code.append('@' + this.name, this);

				this.forEach(function (child, k) {
					code.append(' ');
					child.toCode(code);
				});

				code.append(';');
				code.appendStyle('at-rule-inline-after');
			}
		}
	});
})(require('../../index'));
