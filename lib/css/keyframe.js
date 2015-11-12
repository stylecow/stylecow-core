"use strict";

const stylecow = require('../index');

stylecow.Keyframe = class Keyframe extends require('./classes/node-collection') {

    static create (reader, parent) {
        let element = new stylecow.Keyframe(reader.data());

        element.push(stylecow.KeyframeSelector.create(reader, element) || reader.error());
        element.push(stylecow.Block.create(reader, element) || reader.error());

        return element;
    }

    constructor(data) {
        super(data, 'Keyframe');
    }

    toString () {
        return this.join(' ');
    }

    toCode (code) {
        code.appendStyle('rule-before');
        this.forEach(child => child.toCode(code));
        code.appendStyle('rule-after');
    }
}
