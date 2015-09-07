"use strict";

const EOF = Symbol.for('EOF');

var stylecow = require('../index');

stylecow.Root = class extends require('./classes/node-collection') {

    constructor(data) {
        super(data, 'Root');
    }

    static create (reader) {
        var element = new stylecow.Root(reader.data());

        while (reader.currToken !== EOF) {
            element.push(
                    stylecow.AtRule.createCharset(reader)
                 || stylecow.Comment.create(reader)
                 || stylecow.AtRule.createImport(reader)
                 || stylecow.NestedAtRule.createMedia(reader)
                 || stylecow.AtRule.createCustomMedia(reader)
                 || stylecow.AtRule.createCustomSelector(reader)
                 || stylecow.AtRule.createNamespace(reader)
                 || stylecow.NestedAtRule.createSupports(reader)
                 || stylecow.NestedAtRule.createKeyframes(reader)
                 || stylecow.Document.create(reader)
                 || stylecow.NestedAtRule.create(reader)
                 || stylecow.Rule.create(reader)
                 || reader.error()
            );
        }

        return element;
    }

    toString () {
        return this.map(function (child) {
            return child.toString();
        }).filter(function (string) {
            return string ? true : false;
        }).join("\n");
    }

    toCode (code) {
        this.forEach(function (child, k) {
            child.toCode(code);
        });
    }
}
