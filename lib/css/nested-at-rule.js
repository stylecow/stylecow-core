"use strict";

const AT                 = Symbol.for('AT');
const NAME               = Symbol.for('NAME');
const OPEN_CURLY_BRACKET = Symbol.for('OPEN_CURLY_BRACKET');

var stylecow = require('../index');

stylecow.NestedAtRule = class extends require('./classes/node-collection-vendor') {

    static create (reader, parent) {

        if (reader.currToken === AT && reader.nextToken === NAME) {
            reader.move();

            let element = (new stylecow.NestedAtRule(reader.data())).setNameWithVendor(reader.getStringAndMove());

            switch (element.name) {
                case 'counter-style':
                case 'font-feature-values':
                case 'keyframes':
                    element.push(stylecow.Keyword.create(reader, element) || reader.error());
                    break;

                case 'page':
                    if (reader.currToken !== OPEN_CURLY_BRACKET) {
                        element.push(stylecow.Selectors.create(reader, element) || reader.error());
                    }
                    break;

                case 'supports':
                    element.push(stylecow.ConditionalSelector.create(reader, element) || reader.error());
                    break;

                case 'media':
                    element.push(stylecow.MediaQueries.create(reader, element) || reader.error());
                    break;

                case 'document':
                    element.push(stylecow.Value.create(reader, element) || reader.error());
                    break;
            }

            element.push(stylecow.Block.create(reader, element) || reader.error());

            return element;
        }
    }

    constructor(data) {
        super(data, 'AtRule');
    }

    toString () {
        return '@' + this.getNameWithVendor() + ' ' + this.join(' ');
    }

    toCode (code) {
        code.appendStyle('at-rule-block-before');
        code.append('@' + this.getNameWithVendor() + ' ', this);

        this.forEach(function (child, k) {
            child.toCode(code);
        });

        code.appendStyle('at-rule-block-after');
    }
}
