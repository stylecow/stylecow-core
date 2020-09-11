import NodeCollection from "./classes/node-collection.js";
import KeyframeSelector from "./keyframe-selector.js";
import Block from "./block.js";

export default class Keyframe extends NodeCollection {

    static create (reader, parent) {
        const element = new Keyframe(reader.data());

        element.push(KeyframeSelector.create(reader, element) || reader.error());
        element.push(Block.create(reader, element) || reader.error());

        return element;
    }

    constructor(data) {
        super(data, 'Keyframe');
    }

    toString () {
        return this.join(' ');
    }

    toCode (code) {
        code.appendStyle('rule-before');
        this.forEach(child => child.toCode(code));
        code.appendStyle('rule-after');
    }
}
