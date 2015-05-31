(function (stylecow) {

	stylecow.CustomSelector = function () {
		this.class = 'CustomSelector';
		this.type = 'AtRule';
		this.name = 'custom-selector';
		this.data = {};
	};

	stylecow.CustomSelector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'custom-selector') {
			var element = (new stylecow.CustomSelector()).setSource(reader);
			reader.move();
			reader.move();

			element.push(stylecow.ExtensionName.create(reader) || reader.error());
			element.push(stylecow.Selectors.create(reader) || reader.error());

			reader.skip(t.SEMICOLON);
			
			return element;
		}
	};

	stylecow.CustomSelector.prototype = Object.create(stylecow.prototypes.NodeCollectionWithName, {
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
