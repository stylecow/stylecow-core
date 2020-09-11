import NodeName from "./classes/node-name.js";

const PLUS         = Symbol.for('PLUS');
const GREATER_THAN = Symbol.for('GREATER_THAN');
const TILDE        = Symbol.for('TILDE');
const AMPERSAND    = Symbol.for('AMPERSAND');

export default class Combinator extends NodeName {

    static create (reader, parent) {

        if (reader.currToken === PLUS) {
            reader.move();

            return (new Combinator(reader.data())).setName('+');
        }

        if (reader.currToken === GREATER_THAN) {
            reader.move();

            return (new Combinator(reader.data())).setName('>');
        }

        if (reader.currToken === TILDE) {
            reader.move();

            return (new Combinator(reader.data())).setName('~');
        }

        if (reader.currToken === AMPERSAND) {
            reader.move();

            return (new Combinator(reader.data())).setName('&');
        }
    }

    constructor(data) {
        super(data, 'Combinator');
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
