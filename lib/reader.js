"use strict";

const EOF        = Symbol.for('EOF');
const WHITESPACE = Symbol.for('WHITESPACE');

var stylecow = require('./index');

stylecow.Reader = class {

    constructor (tokens, file) {
        this.file = file;
        this.tokens = [];

        var token;

        do {
            token = tokens.get();
            this.tokens.push(token);
        } while (token[0] !== EOF);

        this.pos = 0;

        this.nextNext = this.tokens[this.pos];
        this.nextNextToken = this.nextNext[0];
        this.nextNextStr = this.nextNext[3];

        this.move();
        this.move();
    }

    move () {
        this.prev = this.curr;
        this.prevToken = this.currToken;
        this.prevStr = this.currStr;

        this.curr = this.next;
        this.currToken = this.nextToken;
        this.currStr = this.nextStr;

        this.next = this.nextNext;
        this.nextToken = this.nextNextToken;
        this.nextStr = this.nextNextStr;

        this.nextNext = this.tokens[++this.pos] || [EOF];
        this.nextNextToken = this.nextNext[0];
        this.nextNextStr = this.nextNext[3];

        //skip whitespaces
        if (this.currToken === WHITESPACE) {
            this.move();
        }

        return (this.currToken !== EOF);
    }
    
    data () {
        return {
            line: this.curr[1],
            col: this.curr[2],
            file: this.file
        }
    }
    
    searchNext (tokens) {
        var pos = this.pos - 1;
        var token = this.tokens[pos];

        while(tokens.indexOf(token[0]) === -1) {
            token = this.tokens[++pos];
        }

        return token[0];
    }
    
    getStringAndMove () {
        var str = this.currStr;
        this.move();
        return str;
    }

    skip (type) {
        if (this.currToken === type) {
            this.move();
            return true;
        }
    }

    skipAll (type) {
        while (this.currToken === type) {
            this.move();
        }
    }

    error () {
        throw new Error(`
Parser error! Unespected "${this.currStr}${this.nextStr}" in:
file: ${this.file}
line: ${this.curr[1]}
col:  ${this.curr[2]}`);
    }
}
