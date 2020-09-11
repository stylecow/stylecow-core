import NodeVendor from "./classes/node-vendor.js";

const NAME = Symbol.for('NAME');

export default class Keyword extends NodeVendor {

    static create (reader, parent) {
        if (reader.currToken === NAME) {
            return (new Keyword(reader.data())).setNameWithVendor(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'Keyword');
    }

    toString () {
        return this.getNameWithVendor();
    }
}