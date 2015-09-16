"use strict";

const SEMICOLON = Symbol.for('SEMICOLON');
const NAME      = Symbol.for('NAME');
const COMMA     = Symbol.for('COMMA');

var stylecow = require('../index');

stylecow.Selectors = class Selectors extends require('./classes/node-collection') {

    static create (reader, parent) {
        var element = new stylecow.Selectors(reader.data());

        do {
            if (reader.currToken === SEMICOLON) {
                break;
            }
            
            element.push(stylecow.Selector.create(reader, element) || reader.error());
        } while (reader.currToken === COMMA && reader.move());

        return element;
    }

    constructor(data) {
        super(data, 'Selectors');
    }

    toString () {
        return this.join(', ');
    }

    toCode (code) {
        var latest = this.length - 1;

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
