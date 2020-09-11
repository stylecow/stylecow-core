import NodeCollection from "./classes/node-collection.js";
import Keyword from "./keyword.js"
import Comparator from "./comparator.js"
import String from "./string.js"

const OPEN_SQUARE_BRACKET  = Symbol.for('OPEN_SQUARE_BRACKET');
const CLOSE_SQUARE_BRACKET = Symbol.for('CLOSE_SQUARE_BRACKET');
const NAME              = Symbol.for('NAME');

export default class AttributeSelector extends NodeCollection {

    static create (reader, parent) {
        if (reader.currToken === OPEN_SQUARE_BRACKET) {
            reader.move();

            const element = new AttributeSelector(reader.data());

            //Attribute name
            element.push(Keyword.create(reader, element) || reader.error());

            //Match combinator
            if (reader.currToken !== CLOSE_SQUARE_BRACKET) {
                element.push(Comparator.create(reader, element) || reader.error());

                if (reader.currToken === NAME) {
                    element.push((new String(reader.data())).setName(reader.getStringAndMove()) || reader.error());
                } else {
                    element.push(String.create(reader, element) || reader.error());
                }
            }

            reader.skip(CLOSE_SQUARE_BRACKET) || reader.error();
        
            return element;
        }
    }

    constructor(data) {
        super(data, 'AttributeSelector');
    }

    toString () {
        return '[' + this.join('') + ']';
    }

    toCode (code) {
        code.append('[');
        this.forEach(child => child.toCode(code));
        code.append(']');
    }
}
