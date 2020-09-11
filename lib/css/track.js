import NodeName from "./classes/node-name.js";

const OPEN_SQUARE_BRACKET  = Symbol.for('OPEN_SQUARE_BRACKET');
const CLOSE_SQUARE_BRACKET = Symbol.for('CLOSE_SQUARE_BRACKET');
const NAME                 = Symbol.for('NAME');
const NUMBER               = Symbol.for('NUMBER');
const COMMENT              = Symbol.for('COMMENT');

export default class Track extends NodeName {

    static create (reader, parent) {
        if (reader.currToken === OPEN_SQUARE_BRACKET) {
            reader.move();
            reader.skipAll(COMMENT);
            if (reader.currToken !== NAME && reader.currToken !== NUMBER) {
                reader.error();
            }

            let element = new Track(reader.data());
            element.setName(reader.getStringAndMove());

            reader.skip(CLOSE_SQUARE_BRACKET) || reader.error();
            return element;
        }
    }

    constructor(data) {
        super(data, 'Track');
    }

    toString () {
        return '[' + this.name + ']';
    }
}
