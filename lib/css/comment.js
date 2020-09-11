import NodeName from "./classes/node-name.js";

const COMMENT = Symbol.for('COMMENT');

export default class Comment extends NodeName {

    static create (reader, parent) {
        if (reader.currToken === COMMENT) {
            return (new Comment(reader.data()))
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
        const comments = code.get('comments');

        if (comments === 'all' || (comments === 'important' && this.name[0] === '!')) {
            code.appendStyle('comment-before');
            code.append(this.toString(), this);
            code.appendStyle('comment-after');
        }
    }
}
