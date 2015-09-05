"use strict";

const OPEN_PARENTHESIS  = Symbol.for('OPEN_PARENTHESIS');
const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const NAME              = Symbol.for('NAME');
const EOF               = Symbol.for('EOF');

var stylecow = require('../../index');

stylecow.ConditionalExpression = class extends require('../../classes/node-collection') {

    constructor(data) {
        super(data, 'ConditionalExpression');
    }

    static create (reader) {
        if (reader.currToken === OPEN_PARENTHESIS) {
            reader.move();

            let element = new stylecow.ConditionalExpression(reader.data());

            //not|only
            if (reader.currToken === NAME && (reader.currStr.toLowerCase() === 'only' || reader.currStr.toLowerCase() === 'not')) {
                element.push(stylecow.Keyword.create(reader) || reader.error());
            }

            while (reader.currToken !== CLOSE_PARENTHESIS && reader.currToken !== EOF) {
                if (reader.currToken === OPEN_PARENTHESIS) {
                    element.push(stylecow.ConditionalExpression.create(reader));
                } else if (reader.currToken === NAME) {
                    if (reader.currStr.toLowerCase() === 'and' || reader.currStr.toLowerCase() === 'or') {
                        element.push(stylecow.Keyword.create(reader) || reader.error());
                    } else {
                        element.push(
                                stylecow.ExtensionName.create(reader)
                             || stylecow.ConditionalFeature.create(reader)
                             || stylecow.ConditionalFeatureBoolean.create(reader)
                             || stylecow.ConditionalFeatureRange.create(reader)
                             || reader.error()
                        );
                    }
                } else {
                    reader.error();
                }
            }

            reader.move();

            return element;
        }
    }

    toString () {
        return '(' + this.join(' ') + ')';
    }

    toCode (code) {
        code.append('(');

        var latest = this.length - 1;

        this.forEach(function (child, k) {
            child.toCode(code);

            if (k !== latest) {
                code.append(' ');
            }
        });
        
        code.append(')');
    }
}
