"use strict";

const CLOSE_PARENTHESIS   = Symbol.for('CLOSE_PARENTHESIS');
const EXCLAMATION         = Symbol.for('EXCLAMATION');
const SEMICOLON           = Symbol.for('SEMICOLON');
const CLOSE_CURLY_BRACKET = Symbol.for('CLOSE_CURLY_BRACKET');
const OPEN_CURLY_BRACKET  = Symbol.for('OPEN_CURLY_BRACKET');
const COMMA               = Symbol.for('COMMA');
const EOF                 = Symbol.for('EOF');
const SOLIDUS             = Symbol.for('SOLIDUS');
const PLUS                = Symbol.for('PLUS');
const WHITESPACE          = Symbol.for('WHITESPACE');

var stylecow = require('../index');

stylecow.Value = class Value extends require('./classes/node-collection') {

    static create (reader, parent) {
        var element = new stylecow.Value(reader.data());

        do {
            if (reader.currToken === CLOSE_PARENTHESIS || reader.currToken === EXCLAMATION || reader.currToken === SEMICOLON || reader.currToken === CLOSE_CURLY_BRACKET || reader.currToken === OPEN_CURLY_BRACKET || reader.currToken === COMMA || reader.currToken === EOF) {
                break;
            }

            if (reader.currToken === SOLIDUS || reader.currToken === PLUS) {
                element.push(stylecow.Operator.create(reader, element));
            }

            element.push(
                    stylecow.Function.create(reader, element)
                 || stylecow.Expression.create(reader, element)
                 || stylecow.Comment.create(reader, element)
                 || stylecow.ExtensionName.create(reader, element)
                 || stylecow.Keyword.create(reader, element)
                 || stylecow.Hex.create(reader, element)
                 || stylecow.String.create(reader, element)
                 || stylecow.Unit.create(reader, element)
                 || stylecow.Number.create(reader, element)
                 || stylecow.Operator.create(reader, element)
                 || reader.error()
            );

        } while ((reader.prevToken === WHITESPACE) || reader.currToken === SOLIDUS);

        return element;
    }

    constructor(data) {
        super(data, 'Value');
    }

    toString () {
        return this.join(' ');
    }

    toCode (code) {
        var latest = this.length - 1;

        this.forEach(function (child, k) {
            child.toCode(code);

            if (k !== latest) {
                code.append(' ');
            }
        });
    }
}
