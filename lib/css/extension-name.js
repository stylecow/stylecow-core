import NodeName from "./classes/node-name.js";

const COLON = Symbol.for('COLON');
const NAME  = Symbol.for('NAME');

export default class ExtensionName extends NodeName {

    static create (reader, parent) {
        if (reader.currToken === NAME && reader.currStr.substr(0, 2) === '--') {
            return (new ExtensionName(reader.data())).setName(reader.getStringAndMove().substr(2));
        }

        if (reader.currToken === COLON && reader.nextToken === NAME && reader.nextStr.substr(0, 2) === '--') {
            reader.move();

            return ExtensionName.create(reader, parent);
        }
    }

    constructor(data) {
        super(data, 'ExtensionName');
    }

    toString () {
        return '--' +this.name;
    }
}