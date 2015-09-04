"use strict";

const NAME = Symbol.for('NAME');
const EOF  = Symbol.for('EOF');

var stylecow = require('../../index');

stylecow.MediaQuery = class extends require('../../classes/node-collection') {

    constructor(data) {
        super(data, 'MediaQuery');
    }

    static create (reader) {
        var element = new stylecow.MediaQuery(reader.data());

        // not|only operators
        if (reader.currToken === NAME && (reader.currStr.toLowerCase() === 'only' || reader.currStr.toLowerCase() === 'not')) {
            element.push(stylecow.Keyword.create(reader) || reader.error());
        }

        //media type
        if (reader.currToken === NAME) {
            element.push(stylecow.Keyword.create(reader) || reader.error());

            if (reader.currToken === NAME) {
                if (reader.currStr.toLowerCase() === 'and' || reader.currStr.toLowerCase() === 'or') {
                    element.push(stylecow.Keyword.create(reader) || reader.error());
                } else {
                    return reader.error();
                }
            } else {
                return element;
            }
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
