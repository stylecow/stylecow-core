"use strict";

const NUMBER     = Symbol.for('NUMBER');
const NAME       = Symbol.for('NAME');
const PERCENTAGE = Symbol.for('PERCENTAGE');

const stylecow = require('../index');

stylecow.Unit = class Unit extends require('./classes/node-collection-name') {

    static create (reader, parent) {
        if (reader.currToken === NUMBER && !reader.nextSpace) {
            let element;

            if (reader.nextToken === NAME) {
                element = (new stylecow.Unit(reader.data())).setName(reader.nextStr);
            } else if (reader.nextToken === PERCENTAGE) {
                element = (new stylecow.Unit(reader.data())).setName('%');
            } else {
                return;
            }

            element.push(stylecow.Number.create(reader, element) || reader.error());
            reader.move();

            return element;
        }
    }

    constructor(data) {
        super(data, 'Unit');
    }

    toString () {
        return this.join('') + this.name;
    }

    toCode (code) {
        this.forEach(child => child.toCode(code));
        code.append(this.name, this);
    }
}
