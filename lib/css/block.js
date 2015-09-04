"use strict";

const OPEN_CURLY_BRACKET  = Symbol.for('OPEN_CURLY_BRACKET');
const CLOSE_CURLY_BRACKET = Symbol.for('CLOSE_CURLY_BRACKET');
const EOF                 = Symbol.for('EOF');
const AT                  = Symbol.for('AT');
const COMMENT             = Symbol.for('COMMENT');
const SEMICOLON           = Symbol.for('SEMICOLON');

var stylecow = require('../index');

stylecow.Block = class extends require('../classes/node-collection') {

	constructor() {
		super('Block');
	}

	static create (reader) {
		if (reader.currToken === OPEN_CURLY_BRACKET) {
			var element = (new stylecow.Block()).setSource(reader);

			reader.move();

			while (reader.currToken !== CLOSE_CURLY_BRACKET && reader.currToken !== EOF) {

				//It's a media query?
				if (reader.currToken === AT) {
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
				if (reader.currToken === COMMENT) {
					element.push(stylecow.Comment.create(reader) || reader.error());
					continue;
				}

				//It's a nested rule?
				if (reader.currToken === OPEN_CURLY_BRACKET) {
					reader.move();
					while (reader.currToken !== CLOSE_CURLY_BRACKET && reader.currToken !== EOF) {
						element.push(
							    stylecow.Comment.create(reader)
							 || stylecow.Import.create(reader)
							 || stylecow.Media.create(reader)
							 || stylecow.CustomMedia.create(reader)
							 || stylecow.CustomSelector.create(reader)
							 || stylecow.AtRule.create(reader)
							 || stylecow.Rule.create(reader)
							 || reader.error()
						);
					}
					reader.skip(CLOSE_CURLY_BRACKET) || reader.error();
					continue;
				}


				//is a declaration or a rule?
				var token = reader.searchNext([SEMICOLON, CLOSE_CURLY_BRACKET, OPEN_CURLY_BRACKET, EOF]);

				//is a declaration
				if (token === SEMICOLON || token === CLOSE_CURLY_BRACKET) {
					element.push(
							stylecow.Declaration.createMsFilter(reader)
						 || stylecow.Declaration.create(reader)
						 || reader.error()
					);
					continue;
				}

				//is a nested rule
				if (token === OPEN_CURLY_BRACKET) {
					element.push(stylecow.Rule.create(reader) || reader.error());
					continue;
				}

				//end of file
				if (token === EOF) {
					return reader.error();
				}
			}

			reader.skip(CLOSE_CURLY_BRACKET) || reader.error();

			return element;
		}
	}

	static createDeclarationBlock (reader) {
		if (reader.currToken === OPEN_CURLY_BRACKET) {
			var element = (new stylecow.Block()).setSource(reader);

			reader.move();

			while (reader.currToken !== CLOSE_CURLY_BRACKET) {
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
	}

	static createKeyframesBlock (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken === OPEN_CURLY_BRACKET) {
			var element = (new stylecow.Block()).setSource(reader);

			reader.move();

			while (reader.currToken !== CLOSE_CURLY_BRACKET) {
				element.push(
						stylecow.Comment.create(reader)
					 || stylecow.Rule.createKeyframe(reader)
					 || reader.error()
				);
			}

			reader.move();

			return element;
		}
	}

	toString () {
		return "{\n\t" + this.join("\n").replace(/\n/g, "\n\t") + "\n}";
	}

	toCode (code) {
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
