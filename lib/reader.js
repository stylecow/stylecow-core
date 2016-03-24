"use strict";

const EOF        = Symbol.for('EOF');
const WHITESPACE = Symbol.for('WHITESPACE');
const path       = require('path');

let stylecow = require('./index');

stylecow.Reader = class {

    constructor (tokens, file) {
        this.file = file;
        this.tokens = [];

        let token;

        do {
            token = tokens.get();
            this.tokens.push(token);
        } while (token[0] !== EOF);

        this.pos = -1;
        this.move();
        this.move();
        this.move();
    }

    move () {
        //whitespaces
        this.currSpace = this.nextSpace;
        this.nextSpace = this.nextNextSpace;
        this.nextNextSpace = false;
        
        //tokens
        this.curr = this.next;
        this.next = this.nextNext;
        this.nextNext = this.tokens[++this.pos] || [EOF];

        //skip whitespaces
        if (this.nextNext[0] === WHITESPACE) {
            this.nextNextSpace = true;
            this.nextNext = this.tokens[++this.pos] || [EOF];
        }

        //token types
        this.currToken = this.nextToken;
        this.nextToken = this.nextNextToken;
        this.nextNextToken = this.nextNext[0];

        //tokens strings
        this.currStr = this.nextStr;
        this.nextStr = this.nextNextStr;
        this.nextNextStr = this.nextNext[3];

        return this.currToken !== EOF;
    }
    
    data () {
        return {
            line: this.curr[1],
            col: this.curr[2],
            file: this.file
        }
    }
    
    searchNext (tokens) {
        let pos = this.pos - 2;
        let token = this.tokens[pos];

        while(tokens.indexOf(token[0]) === -1) {
            token = this.tokens[++pos];
        }

        return token[0];
    }
    
    getStringAndMove () {
        let str = this.currStr;
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
        let file = path.relative(process.cwd(), this.file);

        throw new Error(`
Parser error! Unexpected "${this.currStr}${this.nextStr}" in:
file: ${file}
line: ${this.curr[1]}
col:  ${this.curr[2]}
        `);
    }
}
