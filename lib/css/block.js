(function (stylecow) {

	stylecow.Block = function () {
		this.class = 'Block';
		this.type = 'Block';
		this.data = {};
	};

	stylecow.Block.create = function (reader) {
		var t = stylecow.Tokens;


		if (reader.currToken[0] === t.OPEN_CURLY_BRACKET) {
			var element = (new stylecow.Block()).setSource(reader);

			reader.move();

			while (reader.currToken[0] !== t.CLOSE_CURLY_BRACKET && reader.currToken[0] !== t.EOF) {

				//It's a media query?
				if (reader.currToken[0] === t.AT) {
					element.push(
							stylecow.Comment.create(reader)
						 || stylecow.Import.create(reader)
						 || stylecow.Media.create(reader)
						 || stylecow.CustomMedia.create(reader)
						 || stylecow.CustomSelector.create(reader)
						 || stylecow.Namespace.create(reader)
						 || stylecow.Keyframes.create(reader)
						 || stylecow.Supports.create(reader)
						 || stylecow.Extend.create(reader)
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
					var token = reader.get(offset++);

					//is a declaration
					if (token[0] === t.SEMICOLON || token[0] === t.CLOSE_CURLY_BRACKET) {
						element.push(
								stylecow.Declaration.createMsFilter(reader)
							 || stylecow.Declaration.create(reader)
							 || reader.error()
						);
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

	stylecow.Block.createDeclarationBlock = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.OPEN_CURLY_BRACKET) {
			var element = (new stylecow.Block()).setSource(reader);

			reader.move();

			while (reader.currToken[0] !== t.CLOSE_CURLY_BRACKET) {
				element.push(
						stylecow.Comment.create(reader)
					 || stylecow.Declaration.createMsFilter(reader)
					 || stylecow.Declaration.create(reader)
					 || reader.error()
				);
			}

			reader.move();

			return element;
		}
	};

	stylecow.Block.createKeyframesBlock = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.OPEN_CURLY_BRACKET) {
			var element = (new stylecow.Block()).setSource(reader);

			reader.move();

			while (reader.currToken[0] !== t.CLOSE_CURLY_BRACKET) {
				element.push(
						stylecow.Comment.create(reader)
					 || stylecow.Rule.createKeyframe(reader)
					 || reader.error()
				);
			}

			reader.move();

			return element;
		}
	};

	stylecow.Block.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return "{\n\t" + this.join("\n").replace(/\n/g, "\n\t") + "\n}";
			}
		},

		toCode: {
			value: function (code) {
				code.appendStyle('block-opening-bracket-before');
				code.append('{');
				code.pushIndentation();
				code.appendStyle('block-opening-bracket-after');

				this.forEach(function (child, k) {
					child.toCode(code);
				});

				code.popIndentation();
				code.appendStyle('block-closing-bracket-before');
				code.append('}');
				code.appendStyle('block-closing-bracket-after');
			}
		}
	});
})(require('../index'));
