"use strict";

const COMMENT = Symbol.for('COMMENT');

var stylecow = require('../index');

stylecow.Comment = class extends require('../classes/node-name') {

	constructor() {
		super('Comment');
	}

	static create (reader) {
		if (reader.currToken[0] === COMMENT) {
			return (new stylecow.Comment())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	}

	toString () {
		return '/*' + this.name + '*/';
	}

	toCode (code) {
		if (code.style['comments'] === 'all' || (code.style['comments'] === 'important' && this.name[0] === '!')) {
			code.appendStyle('comment-before');
			code.append(this.toString(), this);
			code.appendStyle('comment-after');
		}
	}
}
