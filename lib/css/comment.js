"use strict";

const COMMENT = Symbol.for('COMMENT');

var stylecow = require('../index');

stylecow.Comment = class extends require('../classes/node-name') {

	constructor(reader) {
		super(reader, 'Comment');
	}

	static create (reader) {
		if (reader.currToken === COMMENT) {
			return (new stylecow.Comment(reader))
				.setName(reader.getStringAndMove());
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
