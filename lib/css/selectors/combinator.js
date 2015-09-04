"use strict";

const PLUS         = Symbol.for('PLUS');
const GREATER_THAN = Symbol.for('GREATER_THAN');
const TILDE        = Symbol.for('TILDE');
const WHITESPACE   = Symbol.for('WHITESPACE');
const AMPERSAND    = Symbol.for('AMPERSAND');

var stylecow = require('../../index');

stylecow.Combinator = class extends require('../../classes/node-name') {

	constructor(data) {
		super(data, 'Combinator');
	}

	static create (reader) {
		if (reader.currToken === PLUS) {
			reader.move();

			return (new stylecow.Combinator(reader.data())).setName('+');
		}

		if (reader.currToken === GREATER_THAN) {
			reader.move();

			return (new stylecow.Combinator(reader.data())).setName('>');
		}

		if (reader.currToken === TILDE) {
			reader.move();

			return (new stylecow.Combinator(reader.data())).setName('~');
		}

		if (reader.prevToken === WHITESPACE) {
			return (new stylecow.Combinator(reader.data())).setName(' ');
		}
	}

	static createJoinCombinator (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken === AMPERSAND) {
			reader.move();

			return (new stylecow.Combinator(reader.data())).setName('&');
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
