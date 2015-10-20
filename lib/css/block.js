"use strict";

const OPEN_CURLY_BRACKET  = Symbol.for('OPEN_CURLY_BRACKET');
const CLOSE_CURLY_BRACKET = Symbol.for('CLOSE_CURLY_BRACKET');
const EOF                 = Symbol.for('EOF');
const AT                  = Symbol.for('AT');
const COMMENT             = Symbol.for('COMMENT');
const SEMICOLON           = Symbol.for('SEMICOLON');
const AMPERSAND           = Symbol.for('AMPERSAND');
const NAME                = Symbol.for('NAME');

var stylecow = require('../index');

stylecow.Block = class Block extends require('./classes/node-collection') {

    static create (reader, parent) {
        if (reader.currToken === OPEN_CURLY_BRACKET) {
            let element = new stylecow.Block(reader.data());

            reader.move();

            //It's a @keyframes
            if (parent && parent.type === 'AtRule' && parent.name === 'keyframes') {
                while (reader.currToken !== CLOSE_CURLY_BRACKET && reader.currToken !== EOF) {
                    element.push(
                            stylecow.Comment.create(reader, element)
                         || stylecow.Keyframe.create(reader, element)
                         || reader.error()
                    );
                }
            }

            //It's a keyframe or custom-property
            else if (parent && (parent.type === 'Keyframe' || parent.type === 'CustomProperty')) {
                while (reader.currToken !== CLOSE_CURLY_BRACKET && reader.currToken !== EOF) {
                    element.push(
                            stylecow.Comment.create(reader, element)
                         || stylecow.Declaration.create(reader, element)
                         || reader.error()
                    );
                }
            }

            else {
                while (reader.currToken !== CLOSE_CURLY_BRACKET && reader.currToken !== EOF) {

                    //It's a media query?
                    if (reader.currToken === AT) {
                        element.push(
                                stylecow.AtRule.create(reader, element)
                             || stylecow.NestedAtRule.create(reader, element)
                             || reader.error()
                        );
                        continue;
                    }

                    //It's a comment
                    if (reader.currToken === COMMENT) {
                        element.push(stylecow.Comment.create(reader, element) || reader.error());
                        continue;
                    }

                    //It's a nested rule?
                    if (reader.currToken === OPEN_CURLY_BRACKET) {
                        reader.move();

                        while (reader.currToken !== CLOSE_CURLY_BRACKET && reader.currToken !== EOF) {
                            element.push(
                                    stylecow.Comment.create(reader, element)
                                 || stylecow.AtRule.create(reader, element)
                                 || stylecow.NestedAtRule.create(reader, element)
                                 || stylecow.Rule.create(reader, element)
                                 || reader.error()
                            );
                        }

                        reader.skip(CLOSE_CURLY_BRACKET) || reader.error();
                        continue;
                    }

                    //It's a nested rule?
                    if (reader.currToken === AMPERSAND) {
                        element.push(stylecow.Rule.create(reader, element) || reader.error());
                        continue;
                    }

                    //It's a custom property?
                    if (reader.currToken === NAME && reader.currStr.substr(0, 2) === '--') {
                        element.push(stylecow.CustomProperty.create(reader, element) || reader.error());
                        continue;
                    }

                    //It's a declaration or a nested rule?
                    let token = reader.searchNext([SEMICOLON, CLOSE_CURLY_BRACKET, OPEN_CURLY_BRACKET, EOF]);

                    //It's a declaration
                    if (token === SEMICOLON || token === CLOSE_CURLY_BRACKET) {
                        element.push(stylecow.Declaration.create(reader, element) || reader.error());
                        continue;
                    }

                    //It's a nested rule
                    if (token === OPEN_CURLY_BRACKET) {
                        element.push(stylecow.Rule.create(reader, element) || reader.error());
                        continue;
                    }

                    //End of file
                    if (token === EOF) {
                        return reader.error();
                    }
                }
            }

            reader.skip(CLOSE_CURLY_BRACKET) || reader.error();

            return element;
        }
    }

    constructor(data) {
        super(data, 'Block');
    }

    toString () {
        return "{\n\t" + this.join("\n").replace(/\n/g, "\n\t") + "\n}";
    }

    toCode (code) {
        code.appendStyle('block-opening-bracket-before');
        code.append('{');
        code.pushIndentation();
        code.appendStyle('block-opening-bracket-after');

        this.forEach(child => child.toCode(code));

        code.popIndentation();
        code.appendStyle('block-closing-bracket-before');
        code.append('}');
        code.appendStyle('block-closing-bracket-after');
    }
}
