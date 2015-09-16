"use strict";

const OPEN_SQUARE_BRACKET  = Symbol.for('OPEN_SQUARE_BRACKET');
const CLOSE_SQUARE_BRACKET = Symbol.for('CLOSE_SQUARE_BRACKET');
const NAME              = Symbol.for('NAME');

var stylecow = require('../index');

stylecow.AttributeSelector = class AttributeSelector extends require('./classes/node-collection') {

    static create (reader, parent) {
        if (reader.currToken === OPEN_SQUARE_BRACKET) {
            reader.move();

            let element = new stylecow.AttributeSelector(reader.data());

            //Attribute name
            element.push(stylecow.Keyword.create(reader, element) || reader.error());

            //Match combinator
            if (reader.currToken !== CLOSE_SQUARE_BRACKET) {
                element.push(stylecow.Comparator.create(reader, element) || reader.error());

                if (reader.currToken === NAME) {
                    element.push((new stylecow.String(reader.data())).setName(reader.getStringAndMove()) || reader.error());
                } else {
                    element.push(stylecow.String.create(reader, element) || reader.error());
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
