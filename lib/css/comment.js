"use strict";

const COMMENT = Symbol.for('COMMENT');

var stylecow = require('../index');

stylecow.Comment = class Comment extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === COMMENT) {
            return (new stylecow.Comment(reader.data()))
                .setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'Comment');
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
