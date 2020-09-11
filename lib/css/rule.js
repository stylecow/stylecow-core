import NodeCollection from "./classes/node-collection.js";
import Selectors from "./selectors.js";
import Block from "./block.js";

export default class Rule extends NodeCollection {

    static create (reader, parent) {
        const element = new Rule(reader.data());

        element.push(Selectors.create(reader, element) || reader.error());
        element.push(Block.create(reader, element) || reader.error());

        return element;
    }

    constructor(data) {
        super(data, 'Rule');
    }

    isEmpty () {
        return this.getChild('Block').isEmpty();
    }

    toString () {
        return this.join(' ');
    }

    toCode (code) {
        if (this.isEmpty()) {
            return;
        }

        code.appendStyle('rule-before');
        this.forEach(child => child.toCode(code));
        code.appendStyle('rule-after');
    }
}
