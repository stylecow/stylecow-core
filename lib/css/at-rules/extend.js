(function (stylecow) {

	stylecow.Extend = function () {
		this.class = 'Extend';
		this.type = 'AtRule';
		this.name = 'extend';
		this.data = {};
	};

	stylecow.Extend.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'extend') {
			var element = (new stylecow.Extend()).setSource(reader);
			reader.move();
			reader.move();

			element.push(stylecow.Selector.create(reader));

			reader.skip(t.SEMICOLON);

			return element;
		}
	};

	stylecow.Extend.prototype = Object.create(stylecow.prototypes.NodeCollectionWithName, {
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
