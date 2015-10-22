"use strict";

const AT               = Symbol.for('AT');
const NAME             = Symbol.for('NAME');
const SEMICOLON        = Symbol.for('SEMICOLON');
const OPEN_PARENTHESIS = Symbol.for('OPEN_PARENTHESIS');
const STRING           = Symbol.for('STRING');

let stylecow = require('../index');

stylecow.AtRule = class AtRule extends require('./classes/node-collection-name') {

    static create (reader, parent) {
        if (reader.currToken === AT && reader.nextToken === NAME) {
            let element;

            switch (reader.nextStr) {
                case 'charset':
                    element = create(reader);
                    element.push(stylecow.String.create(reader, element) || reader.error());

                    reader.skip(SEMICOLON);

                    return element;

                case 'custom-media':
                    element = create(reader);
                    element.push(stylecow.ExtensionName.create(reader, element) || reader.error());
                    element.push(stylecow.MediaQueries.create(reader, element) || reader.error());

                    reader.skip(SEMICOLON);

                    return element;

                case 'custom-selector':
                    element = create(reader);
                    element.push(stylecow.ExtensionName.create(reader, element) || reader.error());
                    element.push(stylecow.Selectors.create(reader, element) || reader.error());

                    reader.skip(SEMICOLON);

                    return element;

                case 'apply':
                    element = create(reader);
                    element.push(stylecow.ExtensionName.create(reader, element) || reader.error());

                    reader.skip(SEMICOLON);

                    return element;

                case 'extend':
                    element = create(reader);
                    element.push(stylecow.Selector.create(reader, element));

                    reader.skip(SEMICOLON);

                    return element;

                case 'import':
                    element = create(reader);

                    if (reader.currToken === STRING) {
                        element.push(createUrlFromString(reader));
                    } else {
                        element.push(stylecow.Function.create(reader, element) || reader.error());
                    }

                    if (reader.currToken === NAME || reader.currToken === OPEN_PARENTHESIS) {
                        element.push(stylecow.MediaQueries.create(reader, element) || reader.error());
                    }

                    reader.skip(SEMICOLON);

                    return element;

                case 'namespace':
                    element = create(reader);

                    if (reader.currToken === NAME) {
                        element.push(stylecow.Keyword.create(reader, element) || reader.error());
                    }

                    if (reader.currToken === STRING) {
                        element.push(createUrlFromString(reader));
                    } else {
                        element.push(stylecow.Function.create(reader, element) || reader.error());
                    }

                    reader.skip(SEMICOLON);

                    return element;
            }
        }
    }

    constructor(data) {
        super(data, 'AtRule');
    }

    toString () {
        return '@' + this.name + ' ' + this.join(' ') + ';';
    }

    toCode (code) {
        code.appendStyle('at-rule-inline-before');
        code.append('@' + this.name);

        this.forEach(function (child, k) {
            code.append(' ');
            child.toCode(code);
        });

        code.append(';');
        code.appendStyle('at-rule-inline-after');
    }
}

function create(reader) {
    reader.move();

    return (new stylecow.AtRule(reader.data())).setName(reader.getStringAndMove());
}

function createUrlFromString(reader) {
    let element = (new stylecow.Function(reader.data())).setName('url');
    let value = new stylecow.Value(reader.data());
    element.push(value);
    value.push(stylecow.String.create(reader, value) || reader.error());

    return element;
}
