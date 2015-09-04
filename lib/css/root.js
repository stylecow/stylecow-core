"use strict";

const EOF = Symbol.for('EOF');

var stylecow = require('../index');

stylecow.Root = class extends require('../classes/node-collection') {

	constructor() {
		super('Root');
	}

	static create (reader) {
		var element = (new stylecow.Root()).setSource(reader);

		while (reader.currToken !== EOF) {
			element.push(
					stylecow.Charset.create(reader)
				 || stylecow.Comment.create(reader)
				 || stylecow.Import.create(reader)
				 || stylecow.Media.create(reader)
				 || stylecow.CustomMedia.create(reader)
				 || stylecow.CustomSelector.create(reader)
				 || stylecow.Namespace.create(reader)
				 || stylecow.Supports.create(reader)
				 || stylecow.Keyframes.create(reader)
				 || stylecow.Document.create(reader)
				 || stylecow.AtRule.create(reader)
				 || stylecow.Rule.create(reader)
				 || reader.error()
			);
		}

		return element;
	}

	toString () {
		return this.map(function (child) {
			return child.toString();
		}).filter(function (string) {
			return string ? true : false;
		}).join("\n");
	}

	toCode (code) {
		this.forEach(function (child, k) {
			child.toCode(code);
		});
	}
}
