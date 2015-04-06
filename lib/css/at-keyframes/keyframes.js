(function (stylecow) {

	stylecow.Keyframes = function (name) {
		this.class = 'Media';
		this.type = 'AtRule';
		this.setFullName(name);
	};

	stylecow.Keyframes.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3].match(/^(-(\w+)-)?keyframes$/)) {
			reader.move();

			var element = new stylecow.Keyframes(reader.getAndMove()[3]);

			element.push(stylecow.Keyword.create(reader) || reader.error());
			element.push(stylecow.KeyframesBlock.create(reader) || reader.error());

			return element;
		}
	};

	stylecow.Keyframes.prototype = Object.create(stylecow.Keyword.prototype, {
		toString: {
			value: function () {
				return '@' + (this.vendor ? '-' + this.vendor + '-' : '') + this.name + ' ' + this.join(' ');
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
