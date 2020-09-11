import NodeName from "./classes/node-name.js";

const PERCENTAGE = Symbol.for('PERCENTAGE');
const NAME       = Symbol.for('NAME');

export default class PlaceholderSelector extends NodeName {

    static create (reader, parent) {
        if (reader.currToken === PERCENTAGE && reader.nextToken === NAME) {
            reader.move();

            return (new PlaceholderSelector(reader.data())).setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'PlaceholderSelector');
    }

    toString () {
        return '%' + this.name;
    }
}
