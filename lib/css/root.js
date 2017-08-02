"use strict";

const EOF = Symbol.for('EOF');

const stylecow = require('../index');

stylecow.Root = class Root extends require('./classes/node-collection') {

    static create (reader, parent) {
        const element = new stylecow.Root(reader.data());

        while (reader.currToken !== EOF) {
            element.push(
                    stylecow.AtRule.create(reader, element)
                 || stylecow.NestedAtRule.create(reader, element)
                 || stylecow.Comment.create(reader, element)
                 || stylecow.Rule.create(reader, element)
                 || reader.error()
            );
        }

        return element;
    }

    constructor(data) {
        super(data, 'Root');
    }

    toString () {
        return this
            .map(child => child.toString())
            .filter(string => string ? true : false)
            .join("\n");
    }

    toCode (code) {
        this.forEach(child => child.toCode(code));
    }
}
