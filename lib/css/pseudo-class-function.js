"use strict";

const OPEN_PARENTHESIS  = Symbol.for('OPEN_PARENTHESIS');
const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const NAME              = Symbol.for('NAME');
const COLON             = Symbol.for('COLON');
const NUMBER            = Symbol.for('NUMBER');
const COMMA             = Symbol.for('COMMA');

const stylecow = require('../index');

stylecow.PseudoClassFunction = class PseudoClassFunction extends require('./classes/node-collection-vendor') {

    static create (reader, parent) {
        if (reader.currToken === COLON && reader.nextToken === NAME && reader.nextNextToken === OPEN_PARENTHESIS) {
            reader.move();

            let element = (new stylecow.PseudoClassFunction(reader.data())).setNameWithVendor(reader.getStringAndMove());

            reader.skip(OPEN_PARENTHESIS) || reader.error();

            //Contains selectors
            if (element.is({ name:['not', 'matches', 'has'] })) {
                do {
                    element.push(stylecow.Selector.create(reader, element) || reader.error());
                } while (reader.currToken === COMMA && reader.move());
            }

            //Contains position
            else if (element.is({ name: /^(-(\w+)-)?(nth-.+)$/ })) {
                let value = new stylecow.Value(reader.data());
                element.push(value);

                // odd / even
                if (reader.currToken === NAME && (reader.currStr === 'odd' || reader.currStr === 'even')) {
                    value.push(stylecow.Keyword.create(reader, element) || reader.error());
                // an+b
                } else {
                    if (reader.currToken === NUMBER && reader.nextToken === NAME && reader.nextStr === 'n') {
                        value.push(stylecow.Unit.create(reader, element) || reader.error());
                    } else if (reader.currToken === NAME && reader.currStr === 'n') {
                        let unit = (new stylecow.Unit(reader.data())).setName(reader.getStringAndMove());

                        unit.push((new stylecow.Number(reader.data())).setName(1));

                        value.push(unit);
                    } else {
                        value.push(stylecow.Number.create(reader, element) || reader.error());
                    }

                    //n+1 can be tokenized as n1
                    if (reader.currToken === NUMBER) {
                        value.push((new stylecow.Operator(reader.data())).setName('+'));
                        value.push(stylecow.Number.create(reader, element) || reader.error());
                    } else {
                        let child = stylecow.Operator.create(reader, element);

                        if (child) {
                            value.push(child);
                            value.push(stylecow.Number.create(reader, element) || reader.error());
                        }
                    }
                }
            }

            //Default
            else {
                do {
                    element.push(stylecow.Value.create(reader, element) || reader.error());
                } while (reader.currToken === COMMA && reader.move());
            }

            reader.skip(CLOSE_PARENTHESIS) || reader.error();

            return element;
        }
    }

    constructor(data) {
        super(data, 'PseudoClass');
    }

    toString () {
        return ':' + this.getNameWithVendor() + '(' + this.join(', ') + ')';
    }

    toCode (code) {
        code.append(':' + this.getNameWithVendor() + '(', this);
        code.appendStyle('function-opening-parenthesis-after');

        let latest = this.length - 1;

        this.forEach(function (child, k) {
            child.toCode(code);

            if (k !== latest) {
                code.appendStyle('function-comma-before');
                code.append(',');
                code.appendStyle('function-comma-after');
            }
        });

        code.appendStyle('function-closing-parenthesis-before');
        code.append(')');
    }
}
