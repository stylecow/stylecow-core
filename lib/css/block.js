(function (stylecow) {

	stylecow.Block = function () {
		this.class = 'Block';
		this.type = 'Block';
	};

	stylecow.Block.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.OPEN_CURLY_BRACKET) {
			var element = new stylecow.Block();

			reader.next(true);

			while (reader.currToken[0] !== t.CLOSE_CURLY_BRACKET) {
				var child = stylecow.Declaration.create(reader);
				
				if (!child) {
					return stylecow.Error.fromToken(reader);
				}

				element.push(child);

				reader.skipWhitespace();
			}

			return element;
		}
	};

	stylecow.Block.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return "{\n\t" + this.join("\n").replace(/\n/g, "\n\t") + "\n}";
			}
		},

		toCode: {
			value: function (code) {
				code.pushIndent(code.style.indent);
				code.append(code.style.rulesetStart);

				latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);
					
					if (k !== latest) {
						code.append(code.style.linebreak);
					}
				});

				code.popIndent();
				code.append(code.style.rulesetEnd);
			}
		}
	});
})(require('../index'));
