(function (stylecow) {

	stylecow.CustomMedia = function () {
		this.class = 'CustomMedia';
		this.type = 'AtRule';
		this.name = 'custom-media';
		this.data = {};
	};

	stylecow.CustomMedia.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'custom-media') {
			var element = (new stylecow.CustomMedia()).setSource(reader);
			reader.move();
			reader.move();

			element.push(stylecow.ExtensionName.create(reader) || reader.error());
			element.push(stylecow.MediaQueries.create(reader) || reader.error());

			reader.skip(t.SEMICOLON);
			
			return element;
		}
	};

	stylecow.CustomMedia.prototype = Object.create(stylecow.prototypes.NodeCollectionWithName, {
		toString: {
			value: function () {
				return '@' + this.name + ' ' + this.join(' ') + ';';
			}
		},

		toCode: {
			value: function (code) {
				code.appendStyle('at-rule-before');
				code.append('@' + this.name, this);

				this.forEach(function (child, k) {
					code.append(' ');
					child.toCode(code);
				});

				code.append(';');
				code.appendStyle('at-rule-after');
			}
		}
	});
})(require('../../index'));
