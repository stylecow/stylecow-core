import NodeCollection from "./classes/node-collection.js";
import Keyword from "./keyword.js";
import ExtensionName from "./extension-name.js";
import ConditionalFeature from "./conditional-feature.js";
import ConditionalFeatureBoolean from "./conditional-feature-boolean.js";
import ConditionalFeatureRange from "./conditional-feature-range.js";

const OPEN_PARENTHESIS  = Symbol.for('OPEN_PARENTHESIS');
const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const NAME              = Symbol.for('NAME');
const NUMBER            = Symbol.for('NUMBER');
const EOF               = Symbol.for('EOF');

export default class ConditionalExpression extends NodeCollection {

    static create (reader, parent) {
        if (reader.currToken === OPEN_PARENTHESIS) {
            reader.move();

            const element = new ConditionalExpression(reader.data());

            //not|only
            if (reader.currToken === NAME && (reader.currStr.toLowerCase() === 'only' || reader.currStr.toLowerCase() === 'not')) {
                element.push(Keyword.create(reader, element) || reader.error());
            }

            while (reader.currToken !== CLOSE_PARENTHESIS && reader.currToken !== EOF) {
                if (reader.currToken === OPEN_PARENTHESIS) {
                    element.push(ConditionalExpression.create(reader, element));
                } else if (reader.currToken === NAME) {
                    if (reader.currStr.toLowerCase() === 'and' || reader.currStr.toLowerCase() === 'or') {
                        element.push(Keyword.create(reader, element) || reader.error());
                    } else {
                        element.push(
                                ExtensionName.create(reader, element)
                             || ConditionalFeature.create(reader, element)
                             || ConditionalFeatureBoolean.create(reader, element)
                             || ConditionalFeatureRange.create(reader, element)
                             || reader.error()
                        );
                    }
                } else if (reader.currToken === NUMBER) {
                    element.push(
                            ConditionalFeatureRange.create(reader, element)
                         || reader.error()
                    );
                } else {
                    reader.error();
                }
            }

            reader.move();

            return element;
        }
    }

    constructor(data) {
        super(data, 'ConditionalExpression');
    }

    toString () {
        return '(' + this.join(' ') + ')';
    }

    toCode (code) {
        code.append('(');

        const latest = this.length - 1;

        this.forEach(function (child, k) {
            child.toCode(code);

            if (k !== latest) {
                code.append(' ');
            }
        });
        
        code.append(')');
    }
}
