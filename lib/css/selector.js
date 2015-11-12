"use strict";

const CLOSE_PARENTHESIS  = Symbol.for('CLOSE_PARENTHESIS');
const OPEN_CURLY_BRACKET = Symbol.for('OPEN_CURLY_BRACKET');
const SEMICOLON          = Symbol.for('SEMICOLON');
const COMMA              = Symbol.for('COMMA');
const EOF                = Symbol.for('EOF');

const AMPERSAND          = Symbol.for('AMPERSAND');
const PLUS               = Symbol.for('PLUS');
const GREATER_THAN       = Symbol.for('GREATER_THAN');
const TILDE              = Symbol.for('TILDE');

const stylecow = require('../index');

stylecow.Selector = class Selector extends require('./classes/node-collection') {

    static create (reader, parent) {
        let element = new stylecow.Selector(reader.data());
        let child;

        do {
            if (element.length
                 && reader.currSpace
                 && (child.type !== 'Combinator' || child.name === '&')
                 && reader.currToken !== PLUS
                 && reader.currToken !== GREATER_THAN
                 && reader.currToken !== TILDE
            ) {
                element.push((new stylecow.Combinator(reader.data())).setName(' '));
            }

            child = stylecow.Combinator.create(reader, element)
                 || stylecow.ExtensionName.create(reader, element)
                 || stylecow.TypeSelector.create(reader, element)
                 || stylecow.Comment.create(reader, element)
                 || stylecow.AttributeSelector.create(reader, element)
                 || stylecow.UniversalSelector.create(reader, element)
                 || stylecow.ClassSelector.create(reader, element)
                 || stylecow.IdSelector.create(reader, element)
                 || stylecow.PseudoClassFunction.create(reader, element)
                 || stylecow.PseudoClass.create(reader, element)
                 || stylecow.PseudoElement.create(reader, element)
                 || stylecow.PlaceholderSelector.create(reader, element)
                 || reader.error();

            element.push(child);
        } while (reader.currToken !== COMMA && reader.currToken !== EOF && reader.currToken !== CLOSE_PARENTHESIS && reader.currToken !== OPEN_CURLY_BRACKET && reader.currToken !== SEMICOLON);

        return element;
    }

    constructor(data) {
        super(data, 'Selector');
    }

    toString () {
        return this.join('');
    }

    toCode (code) {
        this.forEach(child => child.toCode(code));
    }
}
