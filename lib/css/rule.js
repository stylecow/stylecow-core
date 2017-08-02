"use strict";

const stylecow = require('../index');

stylecow.Rule = class Rule extends require('./classes/node-collection') {

    static create (reader, parent) {
        const element = new stylecow.Rule(reader.data());

        element.push(stylecow.Selectors.create(reader, element) || reader.error());
        element.push(stylecow.Block.create(reader, element) || reader.error());

        return element;
    }

    constructor(data) {
        super(data, 'Rule');
    }

    isEmpty () {
        return this.getChild('Block').isEmpty();
    }

    toString () {
        return this.join(' ');
    }

    toCode (code) {
        if (this.isEmpty()) {
            return;
        }

        code.appendStyle('rule-before');
        this.forEach(child => child.toCode(code));
        code.appendStyle('rule-after');
    }
}
