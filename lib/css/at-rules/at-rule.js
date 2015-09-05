"use strict";

const AT               = Symbol.for('AT');
const NAME             = Symbol.for('NAME');
const SEMICOLON        = Symbol.for('SEMICOLON');
const OPEN_PARENTHESIS = Symbol.for('OPEN_PARENTHESIS');

var stylecow = require('../../index');

stylecow.AtRule = class extends require('../../classes/node-collection-name') {

    constructor(data) {
        super(data, 'AtRule');
    }

    static createCharset (reader) {
        if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr === 'charset') {
            let element = (new stylecow.AtRule(reader.data())).setName('charset');
            reader.move();
            reader.move();

            element.push(stylecow.String.create(reader) || reader.error());

            reader.skip(SEMICOLON);

            return element;
        }
    }

    static createCustomMedia (reader) {
        if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr === 'custom-media') {
            let element = (new stylecow.AtRule(reader.data())).setName('custom-media');
            reader.move();
            reader.move();

            element.push(stylecow.ExtensionName.create(reader) || reader.error());
            element.push(stylecow.MediaQueries.create(reader) || reader.error());

            reader.skip(SEMICOLON);
            
            return element;
        }
    }

    static createCustomSelector (reader) {
        if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr === 'custom-selector') {
            let element = (new stylecow.AtRule(reader.data())).setName('custom-selector');
            reader.move();
            reader.move();

            element.push(
                    stylecow.ExtensionName.create(reader)
                 || stylecow.ExtensionName.createFromCustomSelector(reader)
                 || reader.error()
            );
            element.push(stylecow.Selectors.create(reader) || reader.error());

            reader.skip(SEMICOLON);
            
            return element;
        }
    }

    static createExtend (reader) {
        if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr === 'extend') {
            let element = (new stylecow.AtRule(reader.data())).setName('extend');
            reader.move();
            reader.move();

            element.push(stylecow.Selector.create(reader));

            reader.skip(SEMICOLON);

            return element;
        }
    }

    static createImport (reader) {
        if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr === 'import') {
            let element = (new stylecow.AtRule(reader.data())).setName('import');
            reader.move();
            reader.move();

            element.push(stylecow.Function.createUrl(reader, true) || reader.error());

            if (reader.currToken === NAME || reader.currToken === OPEN_PARENTHESIS) {
                element.push(stylecow.MediaQueries.create(reader) || reader.error());
            }

            reader.skip(SEMICOLON);

            return element;
        }
    }

    static createNamespace (reader) {
        if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr === 'namespace') {
            let element = (new stylecow.AtRule(reader.data())).setName('namespace');
            reader.move();
            reader.move();

            if (reader.currToken === NAME) {
                element.push(stylecow.Keyword.create(reader) || reader.error());
            }

            element.push(stylecow.Function.createUrl(reader, true) || reader.error());

            reader.skip(SEMICOLON);

            return element;
        }
    }

    toString () {
        return '@' + this.name + ' ' + this.join(' ') + ';';
    }

    toCode (code) {
        code.appendStyle('at-rule-inline-before');
        code.append('@' + this.name, this);

        this.forEach(function (child, k) {
            code.append(' ');
            child.toCode(code);
        });

        code.append(';');
        code.appendStyle('at-rule-inline-after');
    }
}
