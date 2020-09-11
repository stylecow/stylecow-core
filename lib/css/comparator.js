import NodeName from "./classes/node-name.js";

const EQUALS        = Symbol.for('EQUALS');
const TILDE         = Symbol.for('TILDE');
const VERTICAL_LINE = Symbol.for('VERTICAL_LINE');
const CARET         = Symbol.for('CARET');
const DOLLAR        = Symbol.for('DOLLAR');
const ASTERISK      = Symbol.for('ASTERISK');
const LESS_THAN     = Symbol.for('LESS_THAN');
const GREATER_THAN  = Symbol.for('GREATER_THAN');

export default class Comparator extends NodeName {

    static create (reader, parent) {
        if (reader.currToken === EQUALS) {
            reader.move();

            return (new Comparator(reader.data())).setName('=');
        }

        if (reader.nextToken === EQUALS) {
            if (reader.currToken === TILDE) {
                const element = (new Comparator(reader.data())).setName('~=');

                reader.move();
                reader.move();

                return element;
            }

            if (reader.currToken === VERTICAL_LINE) {
                const element = (new Comparator(reader.data())).setName('|=');

                reader.move();
                reader.move();

                return element;
            }

            if (reader.currToken === CARET) {
                const element = (new Comparator(reader.data())).setName('^=');

                reader.move();
                reader.move();

                return element;
            }

            if (reader.currToken === DOLLAR) {
                const element = (new Comparator(reader.data())).setName('$=');

                reader.move();
                reader.move();

                return element;
            }

            if (reader.currToken === ASTERISK) {
                const element = (new Comparator(reader.data())).setName('*=');

                reader.move();
                reader.move();

                return element;
            }
        }

        if (reader.currToken === LESS_THAN) {
            if (reader.nextToken === EQUALS) {
                const element = (new Comparator(reader.data())).setName('<=');

                reader.move();
                reader.move();

                return element;
            }

            reader.move();

            return (new Comparator(reader.data())).setName('<');
        }

        if (reader.currToken === GREATER_THAN) {
            if (reader.nextToken === EQUALS) {
                const element = (new Comparator(reader.data())).setName('>=');

                reader.move();
                reader.move();

                return element;
            }
            
            reader.move();

            return (new Comparator(reader.data())).setName('>');
        }
    }

    constructor(data) {
        super(data, 'Comparator');
    }

    toString () {
        return this.name;
    }

    toCode (code) {
        code.appendStyle('comparator-before');
        code.append(this.name);
        code.appendStyle('comparator-after');
    }
}
