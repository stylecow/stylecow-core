"use strict";

const COMMENT = Symbol.for('COMMENT');

var stylecow = require('../index');

stylecow.Comment = class extends require('./classes/node-name') {

    constructor(data) {
        super(data, 'Comment');
    }

    static create (reader) {
        if (reader.currToken === COMMENT) {
            return (new stylecow.Comment(reader.data()))
                .setName(reader.getStringAndMove());
        }
    }

    toString () {
        return '/*' + this.name + '*/';
    }

    toCode (code) {
        var comments = code.get('comments');

        if (comments === 'all' || (comments === 'important' && this.name[0] === '!')) {
            code.appendStyle('comment-before');
            code.append(this.toString(), this);
            code.appendStyle('comment-after');
        }
    }
}
