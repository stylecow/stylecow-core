
const COLON = Symbol.for('COLON');
const NAME  = Symbol.for('NAME');

const stylecow = require('../index');

stylecow.PseudoElement = class PseudoElement extends require('./classes/node-vendor') {

    static create (reader, parent) {
        if (reader.currToken === COLON && reader.nextToken === COLON && reader.nextNextToken === NAME) {
            reader.move();
            reader.move();

            return (new stylecow.PseudoElement(reader.data())).setNameWithVendor(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'PseudoElement');
    }

    toString () {
        return '::' + this.getNameWithVendor();
    }
}
