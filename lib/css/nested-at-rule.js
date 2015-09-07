"use strict";

const AT                 = Symbol.for('AT');
const NAME               = Symbol.for('NAME');
const OPEN_CURLY_BRACKET = Symbol.for('OPEN_CURLY_BRACKET');

var stylecow = require('../index');

stylecow.NestedAtRule = class extends require('./classes/node-collection-vendor') {

    constructor(data) {
        super(data, 'AtRule');
    }

    static create (reader) {

        if (reader.currToken === AT && reader.nextToken === NAME) {
            reader.move();

            let element = (new stylecow.NestedAtRule(reader.data()))
                .setNameWithVendor(reader.getStringAndMove());

            /*
             * at-rules with a keyword:
             *
             * @counter-style
             * @font-feature-values
             */
            if (element.name === 'counter-style' || element.name === 'font-feature-values') {
                element.push(stylecow.Keyword.create(reader) || reader.error());
            }

            /*
             * at-rules with selectors:
             *
             * @page
             */
            else if (element.name === 'page' && reader.currToken !== OPEN_CURLY_BRACKET) {
                element.push(stylecow.Selectors.create(reader) || reader.error());
            }

            element.push(stylecow.Block.create(reader) || reader.error());

            return element;
        }
    }

    static createKeyframes (reader) {
        if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr.endsWith('keyframes')) {
            reader.move();

            let element = (new stylecow.NestedAtRule(reader.data())).setNameWithVendor(reader.getStringAndMove());

            element.push(stylecow.Keyword.create(reader) || reader.error());
            element.push(stylecow.Block.createKeyframesBlock(reader) || reader.error());

            return element;
        }
    }

    static createMedia (reader) {
        if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr === 'media') {
            let element = (new stylecow.NestedAtRule(reader.data())).setName(reader.nextStr);
            reader.move();
            reader.move();

            element.push(stylecow.MediaQueries.create(reader) || reader.error());
            element.push(stylecow.Block.create(reader) || reader.error());

            return element;
        }
    }

    static createSupports (reader) {
        if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr === 'supports') {
            let element = (new stylecow.NestedAtRule(reader.data())).setName(reader.nextStr);
            reader.move();
            reader.move();

            element.push(stylecow.ConditionalSelector.create(reader) || reader.error());
            element.push(stylecow.Block.create(reader) || reader.error());

            return element;
        }
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
