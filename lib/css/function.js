"use strict";

const NAME              = Symbol.for('NAME');
const OPEN_PARENTHESIS  = Symbol.for('OPEN_PARENTHESIS');
const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const COMMA             = Symbol.for('COMMA');
const STRING            = Symbol.for('STRING');

const stylecow = require('../index');

stylecow.Function = class Function extends require('./classes/node-collection-vendor') {

    static create (reader, parent) {
        if (reader.currToken === NAME && reader.nextToken === OPEN_PARENTHESIS) {
            let element = (new stylecow.Function(reader.data())).setNameWithVendor(reader.getStringAndMove());
            let value;

            reader.move();

            switch (element.name) {
                case 'url':
                case 'url-prefix':
                case 'domain':
                    value = new stylecow.Value();
                    element.push(value);

                    // url("address")
                    if (reader.currToken === STRING) {
                        value.push(stylecow.String.create(reader, element) || reader.error());
                    
                    // url(address)
                    } else if (reader.currToken !== CLOSE_PARENTHESIS) {
                        let url = (new stylecow.String(reader.data())).setName('');

                        do {
                            url.name += reader.currStr;
                        } while (reader.move() && reader.currToken !== CLOSE_PARENTHESIS);

                        value.push(url);
                    }
                    break;

                case 'element':
                    value = new stylecow.Value();
                    element.push(value);
                    value.push(stylecow.IdSelector.create(reader, element) || reader.error());
                    break;

                default:
                    do {
                        element.push(stylecow.Value.create(reader, element) || reader.error());

                    } while (reader.skip(COMMA));
                    break;
            }

            reader.skip(CLOSE_PARENTHESIS) || reader.error();

            return element;
        }
    }

    static createUrl (reader, fromString, names) {
        names = names || ['url'];

        //"address"
        if (fromString && reader.currToken === STRING) {
            let element = (new stylecow.Function(reader.data())).setName('url');

            element.push(stylecow.String.create(reader, element) || reader.error());

            return element;
        }
    }

    constructor(data) {
        super(data, 'Function');
    }

    toString () {
        return this.getNameWithVendor() + '(' + this.join(', ') + ')';
    }

    toCode (code) {
        code.append(this.getNameWithVendor() + '(', this);
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
