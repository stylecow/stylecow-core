import NodeCollection from "./classes/node-collection.js";
import Selector from "./selector.js";

const SEMICOLON = Symbol.for('SEMICOLON');
const NAME      = Symbol.for('NAME');
const COMMA     = Symbol.for('COMMA');

export default class Selectors extends NodeCollection {

    static create (reader, parent) {
        const element = new Selectors(reader.data());

        do {
            if (reader.currToken === SEMICOLON) {
                break;
            }
            
            element.push(Selector.create(reader, element) || reader.error());
        } while (reader.skip(COMMA));

        return element;
    }

    constructor(data) {
        super(data, 'Selectors');
    }

    toString () {
        return this.join(', ');
    }

    toCode (code) {
        const latest = this.length - 1;

        this.forEach(function (child, k) {
            child.toCode(code);

            if (k !== latest) {
                code.appendStyle('selector-comma-before');
                code.append(',');
                code.appendStyle('selector-comma-after');
            }
        });
    }
}
