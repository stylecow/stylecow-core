import NodeCollection from "./classes/node-collection.js";
import Function from "./function.js";
import Expression from "./expression.js";
import Comment from "./comment.js";
import ExtensionName from "./extension-name.js";
import Keyword from "./keyword.js";
import Hex from "./hex.js";
import String from "./string.js";
import Unit from "./unit.js";
import Number from "./number.js";
import Operator from "./operator.js";
import Track from "./track.js";

const CLOSE_PARENTHESIS   = Symbol.for('CLOSE_PARENTHESIS');
const EXCLAMATION         = Symbol.for('EXCLAMATION');
const SEMICOLON           = Symbol.for('SEMICOLON');
const CLOSE_CURLY_BRACKET = Symbol.for('CLOSE_CURLY_BRACKET');
const OPEN_CURLY_BRACKET  = Symbol.for('OPEN_CURLY_BRACKET');
const COMMA               = Symbol.for('COMMA');
const EOF                 = Symbol.for('EOF');
const SOLIDUS             = Symbol.for('SOLIDUS');
const PLUS                = Symbol.for('PLUS');

export default class Value extends NodeCollection {

    static create (reader, parent) {
        const element = new Value(reader.data());

        do {
            if (reader.currToken === CLOSE_PARENTHESIS || reader.currToken === EXCLAMATION || reader.currToken === SEMICOLON || reader.currToken === CLOSE_CURLY_BRACKET || reader.currToken === OPEN_CURLY_BRACKET || reader.currToken === COMMA || reader.currToken === EOF) {
                break;
            }

            if (reader.currToken === SOLIDUS || reader.currToken === PLUS) {
                element.push(Operator.create(reader, element));
            }

            element.push(
                    Function.create(reader, element)
                 || Expression.create(reader, element)
                 || Comment.create(reader, element)
                 || ExtensionName.create(reader, element)
                 || Keyword.create(reader, element)
                 || Hex.create(reader, element)
                 || String.create(reader, element)
                 || Unit.create(reader, element)
                 || Number.create(reader, element)
                 || Operator.create(reader, element)
                 || Track.create(reader, element)
                 || reader.error()
            );

        } while (reader.currSpace || reader.currToken === SOLIDUS);

        return element;
    }

    constructor(data) {
        super(data, 'Value');
    }

    toString () {
        return this.join(' ');
    }

    toCode (code) {
        const latest = this.length - 1;

        this.forEach(function (child, k) {
            child.toCode(code);

            if (k !== latest) {
                code.append(' ');
            }
        });
    }
}
