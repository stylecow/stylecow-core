(function (stylecow) {

	stylecow.Block = function () {
		this.class = 'Block';
		this.type = 'Block';
	};

	stylecow.Block.create = function (reader) {
		var t = stylecow.Tokens;


		if (reader.currToken[0] === t.OPEN_CURLY_BRACKET) {
			var element = new stylecow.Block();

			reader.move();

			while (reader.currToken[0] !== t.CLOSE_CURLY_BRACKET) {

				//It's a media query?
				if (reader.currToken[0] === t.AT) {
					element.push(
							stylecow.Charset.create(reader)
						 || stylecow.Comment.create(reader)
						 || stylecow.Import.create(reader)
						 || stylecow.Media.create(reader)
						 || stylecow.CustomMedia.create(reader)
						 || stylecow.Namespace.create(reader)
						 || stylecow.Supports.create(reader)
						 || stylecow.Keyframes.create(reader)
						 || stylecow.AtRule.create(reader)
						 || reader.error()
					);
					continue;
				}

				//It's a comment
				if (reader.currToken[0] === t.COMMENT) {
					element.push(stylecow.Comment.create(reader) || reader.error());
					continue;
				}


				//is a declaration or a rule?
				var offset = 0;

				while (true) {
					var token = reader.get(++offset);

					//is a declaration
					if (token[0] === t.SEMICOLON || token[0] === t.CLOSE_CURLY_BRACKET) {
						element.push(stylecow.Declaration.create(reader) || reader.error());
						break;
					}

					//is a nested rule
					if (token[0] === t.OPEN_CURLY_BRACKET) {
						element.push(stylecow.Rule.create(reader) || reader.error());
						break;
					}

					//end of file
					if (token[0] === t.EOF) {
						return reader.error();
					}
				}
			}

			reader.skip(t.CLOSE_CURLY_BRACKET) || reader.error();

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
