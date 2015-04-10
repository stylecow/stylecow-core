(function (stylecow) {

	stylecow.Media = function () {
		this.class = 'Media';
		this.type = 'AtRule';
		this.name = 'media';
	};

	stylecow.Media.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'media') {
			var element = (new stylecow.Media()).setSource(reader);
			reader.move();
			reader.move();

			element.push(stylecow.MediaQueries.create(reader) || reader.error());
			element.push(stylecow.Block.create(reader) || reader.error());

			return element;
		}
	};

	stylecow.Media.prototype = Object.create(stylecow.prototypes.NodeCollectionWithName, {
		toString: {
			value: function () {
				return '@' + this.name + ' ' + this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				code.appendStyle('at-rule-before');
				code.append('@' + this.name + ' ', this);

				this.forEach(function (child, k) {
					child.toCode(code);
				});
				code.appendStyle('at-rule-after');
			}
		}
	});

})(require('../../index'));
