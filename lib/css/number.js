"use strict";

const NUMBER = Symbol.for('NUMBER');

let stylecow = require('../index');

stylecow.Number = class Number extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === NUMBER) {
            return (new stylecow.Number(reader.data())).setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'Number');
    }

    toString () {
        return '' + this.name;
    }

    toCode (code) {
        let num = this.toString();

        if (!code.get('number-leading-zero')) {
            if (num.indexOf('0.') === 0) {
                num = num.substr(1);
            } else if (num.indexOf('-0.') === 0) {
                num = '-' + num.substr(2);
            }
        }

        code.append(num, this);
    }
}
