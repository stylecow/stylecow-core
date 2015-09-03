"use strict";

var stylecow = require('../../index');

stylecow.Combinator = class extends require('../../classes/node-name') {

	constructor() {
		super('Combinator');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.PLUS) {
			reader.move();

			return (new stylecow.Combinator())
				.setSource(reader)
				.setName('+');
		}

		if (reader.currToken[0] === t.GREATER_THAN) {
			reader.move();

			return (new stylecow.Combinator())
				.setSource(reader)
				.setName('>');
		}

		if (reader.currToken[0] === t.TILDE) {
			reader.move();

			return (new stylecow.Combinator())
				.setSource(reader)
				.setName('~');
		}

		if (reader.get(-2)[0] === t.WHITESPACE) {
			return (new stylecow.Combinator())
				.setSource(reader)
				.setName(' ');
		}
	}

	static createJoinCombinator (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AMPERSAND) {
			reader.move();

			return (new stylecow.Combinator())
				.setSource(reader)
				.setName('&');
		}
	}

	toString () {
		if (this.name === ' ' || this.name === '&') {
			return this.name;
		}

		if (this.index() === 0) {
			return this.name + ' ';
		}

		return ' ' + this.name + ' ';
	}

	toCode (code) {
		if (this.name === ' ' || this.name === '&') {
			return code.append(this.name);
		}

		if (this.index() !== 0) {
			code.appendStyle('selector-combinator-before');
		}

		code.append(this.name);
		code.appendStyle('selector-combinator-after');
	}
}
