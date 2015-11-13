"use strict";

const COMMA = Symbol.for('COMMA');

const stylecow = require('../index');

stylecow.MediaQueries = class MediaQueries extends require('./classes/node-collection') {

    static create (reader, parent) {
        let element = new stylecow.MediaQueries(reader.data());

        do {
            element.push(stylecow.MediaQuery.create(reader, element) || reader.error());
        } while (reader.skip(COMMA));

        return element;
    }

    constructor(data) {
        super(data, 'MediaQueries');
    }

    toString () {
        return this.join(', ');
    }

    toCode (code) {
        let latest = this.length - 1;

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
