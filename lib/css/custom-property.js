"use strict";

const COLON              = Symbol.for('COLON');
const NAME               = Symbol.for('NAME');
const COMMENT            = Symbol.for('COMMENT');
const COMMA              = Symbol.for('COMMA');
const SEMICOLON          = Symbol.for('SEMICOLON');
const OPEN_CURLY_BRACKET = Symbol.for('OPEN_CURLY_BRACKET');

let stylecow = require('../index');

stylecow.CustomProperty = class CustomProperty extends require('./classes/node-collection-name') {

    static create (reader, parent) {
        if (reader.currToken === NAME && reader.currStr.substr(0, 2) === '--') {
            let element = (new stylecow.CustomProperty(reader.data())).setName(reader.getStringAndMove().substr(2));

            reader.skipAll(COMMENT);
            reader.skip(COLON) || reader.error();

            if (reader.currToken === OPEN_CURLY_BRACKET) {
                element.push(stylecow.Block.create(reader, element) || reader.error());
            } else {
                do {
                    element.push(stylecow.Value.create(reader, element) || reader.error());

                } while (reader.currToken === COMMA && reader.move());
            }

            reader.skip(SEMICOLON);

            return element;
        }
    }

    constructor(data) {
        super(data, 'CustomProperty');
    }

    toString () {
        if (this.hasChild('Block')) {
            return '--' + this.name + ': ' + this.getChild('Block') + ';';
        }

        return '--' + this.name + ': ' + this.getChildren('Value').join(', ') + ';';
    }

    toCode (code) {
        code.appendStyle('declaration-before');
        code.append('--' + this.name, this);
        code.appendStyle('declaration-colon-before');
        code.append(':');
        code.appendStyle('declaration-colon-after');

        if (this.hasChild('Block')) {
            return this.getChild('Block').toCode(code);
        }

        let values = this.getChildren('Value');
        let latest = values.length - 1;

        values.forEach(function (child, k) {
            child.toCode(code);

            if (k !== latest) {
                code.appendStyle('declaration-comma-before');
                code.append(',');
                code.appendStyle('declaration-comma-after');
            }
        });

        code.append(';');
        code.appendStyle('declaration-after');
    }
}