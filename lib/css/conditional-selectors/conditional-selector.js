"use strict";

const NAME = Symbol.for('NAME');
const EOF  = Symbol.for('EOF');

var stylecow = require('../../index');

stylecow.ConditionalSelector = class extends require('../../classes/node-collection') {

    constructor(data) {
        super(data, 'ConditionalSelector');
    }

    static create (reader) {
        var element = new stylecow.ConditionalSelector(reader.data());

        // not|only operators
        if (reader.currToken === NAME && (reader.currStr.toLowerCase() === 'only' || reader.currStr.toLowerCase() === 'not')) {
            element.push(stylecow.Keyword.create(reader) || reader.error());
        }

        while (reader.currToken !== EOF) {
            element.push(stylecow.ConditionalExpression.create(reader) || reader.error());

            // and|or
            if (reader.currToken === NAME && (reader.currStr.toLowerCase() === 'and' || reader.currStr.toLowerCase() === 'or')) {
                element.push(stylecow.Keyword.create(reader) || reader.error());
            } else {
                break;
            }
        }

        return element;
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
