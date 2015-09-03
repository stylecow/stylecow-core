"use strict";

var stylecow = require('../index');

stylecow.Rule = class extends require('../classes/node-collection') {

	constructor() {
		super('Rule');
	}

	static create (reader) {
		var element = (new stylecow.Rule()).setSource(reader);

		element.push(stylecow.Selectors.create(reader) || reader.error());
		element.push(stylecow.Block.create(reader) || reader.error());

		return element;
	}

	static createKeyframe (reader) {
		var element = (new stylecow.Rule()).setSource(reader);

		element.push(stylecow.Selectors.createKeyframeSelectors(reader) || reader.error());
		element.push(stylecow.Block.createDeclarationBlock(reader) || reader.error());

		return element;
	}

	toString () {
		return this.join(' ');
	}

	toCode (code) {
		code.appendStyle('rule-before');

		this.forEach(function (child, k) {
			child.toCode(code);
		});

		code.appendStyle('rule-after');
	}
}
