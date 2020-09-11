import NodeCollection from "./classes/node-collection.js";
import MediaQuery from "./media-query.js";

const COMMA = Symbol.for('COMMA');

export default class MediaQueries extends NodeCollection {

    static create (reader, parent) {
        const element = new MediaQueries(reader.data());

        do {
            element.push(MediaQuery.create(reader, element) || reader.error());
        } while (reader.skip(COMMA));

        return element;
    }

    constructor(data) {
        super(data, 'MediaQueries');
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
