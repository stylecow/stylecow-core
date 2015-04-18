(function (stylecow) {

	stylecow.Number = function () {
		this.class = 'Number';
		this.type = 'Number';
		this.data = {};
	};

	stylecow.Number.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NUMBER) {
			return (new stylecow.Number)
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	};

	stylecow.Number.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return '' + this.name;
			}
		},

		toCode: {
			value: function (code) {
				var num = this.toString();

				if (!code.style['number-leading-zero']) {
					if (num.indexOf('0.') === 0) {
						num = num.substr(1);
					} else if (num.indexOf('-0.') === 0) {
						num = '-' + num.substr(2);
					}
				}

				code.append(num, this);
			}
		}
	});
})(require('../index'));
