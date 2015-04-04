(function (stylecow) {

	stylecow.Supports = function () {
		this.class = 'Supports';
		this.type = 'AtRule';
		this.name = 'supports';
	};

	stylecow.Supports.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'supports') {
			var element = new stylecow.Supports();
			reader.next();
			reader.next(true);

			element.push(stylecow.ConditionalSelector.create(reader) || reader.error());
			element.push(stylecow.Block.create(reader) || reader.error());

			return element;
		}
	};

	stylecow.Supports.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return '@' + this.name + ' ' + this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child, k) {
					child.toCode(code);
				});
			}
		}
	});

})(require('../../index'));
