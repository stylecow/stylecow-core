(function (stylecow) {

	stylecow.Namespace = function () {
		this.class = 'Namespace';
		this.type = 'AtRule';
		this.name = 'namespace';
		this.data = {};
	};

	stylecow.Namespace.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'namespace') {
			var element = (new stylecow.Namespace()).setSource(reader);
			reader.move();
			reader.move();

			if (reader.currToken[0] === t.NAME) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			}

			element.push(stylecow.Function.createUrl(reader, true) || reader.error());

			reader.skip(t.SEMICOLON);

			return element;
		}
	};

	stylecow.Namespace.prototype = Object.create(stylecow.prototypes.NodeCollectionWithName, {
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
