"use strict";

const OPEN_PARENTHESIS  = Symbol.for('OPEN_PARENTHESIS');
const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const EOF               = Symbol.for('EOF');

var stylecow = require('../index');

stylecow.Expression = class Expression extends require('./classes/node-collection') {

    static create (reader, parent) {
        if (reader.currToken === OPEN_PARENTHESIS) {
            let element = new stylecow.Expression(reader.data());

            reader.move();

            do {
                element.push(stylecow.Unit.create(reader, element)
                    || stylecow.Number.create(reader, element)
                    || stylecow.Operator.create(reader, element)
                    || stylecow.Expression.create(reader, element)
                    || stylecow.Function.create(reader, element)
                    || reader.error());

            } while (reader.currToken !== CLOSE_PARENTHESIS && reader.currToken !== EOF);

            reader.skip(CLOSE_PARENTHESIS) || reader.error();

            return element;
        }
    }

    constructor(data) {
        super(data, 'Expression');
    }

    toString () {
        return '(' + this.join(' ') + ')';
    }

    toCode (code) {
        code.append('(');

        var latest = this.length - 1;

        this.forEach(function (child, k) {
            child.toCode(code);

            if (latest !== k) {
                code.append(' ');
            }
        });

        code.append(')');
    }
}
