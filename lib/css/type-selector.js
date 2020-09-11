import NodeName from "./classes/node-name.js";

const NAME  = Symbol.for('NAME');

export default class TypeSelector extends NodeName {

    static create (reader, parent) {
        if (reader.currToken === NAME) {
            return (new TypeSelector(reader.data())).setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'TypeSelector');
    }
}
