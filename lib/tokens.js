var t = function (code) {
    this.code = code;

    this.currChar;
    this.nextChar;

    this.pos = 0;
    this.col = 0;
    this.line = 1;

    this.next();
    this.next();
    this.col = 0;
};

// Available tokens

t.EOF                   =  0;
t.WHITESPACE            =  1;
t.COLON                 =  2; //:
t.SEMICOLON             =  3; //;
t.COMMA                 =  4; //,
t.OPEN_SQUARE_BRACKET   =  5; //[
t.CLOSE_SQUARE_BRACKET  =  6; //]
t.OPEN_CURLY_BRACKET    =  7; //{
t.CLOSE_CURLY_BRACKET   =  8; //}
t.OPEN_PARENTHESIS      =  9; //(
t.CLOSE_PARENTHESIS     = 10; //)
t.AT                    = 11; //@
t.EQUALS                = 12; //=
t.DOLLAR                = 13; //$
t.PLUS                  = 14; //+
t.MINUS                 = 15; //-
t.STOP                  = 16; //.
t.LESS_THAN             = 17; //<
t.GREATER_THAN          = 18; //>
t.ASTERISK              = 19; //*
t.VERTICAL_LINE         = 20; //|
t.TILDE                 = 21; //~
t.COMMENT               = 22;
t.NUMBER                = 23;
t.PERCENTAGE            = 24; //%
t.STRING                = 25;
t.HASH                  = 26; //#some-value
t.NAME                  = 27;
t.EXCLAMATION           = 28; //!
t.AMPERSAND             = 29; //&
t.SOLIDUS               = 30; ///
t.CARET                 = 31; //^
t.UNKNOWN               = 32;

var specialChars = {
    ':': t.COLON,
    ';': t.SEMICOLON,
    ',': t.COMMA,
    '[': t.OPEN_SQUARE_BRACKET,
    ']': t.CLOSE_SQUARE_BRACKET,
    '{': t.OPEN_CURLY_BRACKET,
    '}': t.CLOSE_CURLY_BRACKET,
    '(': t.OPEN_PARENTHESIS,
    ')': t.CLOSE_PARENTHESIS,
    '@': t.AT,
    '=': t.EQUALS,
    '$': t.DOLLAR,
    '+': t.PLUS,
    '-': t.MINUS,
    '.': t.STOP,
    '<': t.LESS_THAN,
    '>': t.GREATER_THAN,
    '*': t.ASTERISK,
    '|': t.VERTICAL_LINE,
    '~': t.TILDE,
    '%': t.PERCENTAGE,
    '!': t.EXCLAMATION,
    '&': t.AMPERSAND,
    '/': t.SOLIDUS,
    '^': t.CARET
};

t.prototype = {
    next: function () {
        this.currChar = this.nextChar;
        this.nextChar = this.nextNextChar;
        this.nextNextChar = this.code.charAt(this.pos++);

        //handle breaklines
        if (this.nextNextChar === '\r') {
            if (this.code.charAt(this.pos + 1) === '\n') {
                ++this.pos;
            }

            this.nextNextChar = '\n';
        } else if (this.nextNextChar === '\f') {
            this.nextNextChar = '\n';
        }

        if (this.currChar === '\n') {
            ++this.line;
            this.col = 0;
        } else {
            ++this.col;
        }

        if (this.currChar === '') {
            return false;
        }

        return true;
    },

    get: function () {
        this.next();

        return this.WHITESPACE()
            || this.HASH()
            || this.COMMENT()
            || this.STRING()
            || this.NUMBER()
            || this.NAME()
            || this.SPECIAL_CHAR()
            || this.END();
    },

    END: function () {
        if (this.currChar === '') {
            return [t.EOF, this.line, this.col];
        }

        return [t.UNKNOWN, this.line, this.col, this.currChar];
        console.error('Unespected character "' + this.currChar + '" (' + this.currChar.charCodeAt(0) + ') in line: ' + this.line + ' column: ' + this.col);
    },

    WHITESPACE: function () {
        if (this.currChar === ' ' || this.currChar === '\t' || this.currChar === '\n') {
            while (this.nextChar === ' ' || this.nextChar === '\t' || this.nextChar === '\n') {
                this.next();
            }

            return [t.WHITESPACE, this.line, this.col];
        }
    },

    SPECIAL_CHAR: function () {
        if (this.currChar in specialChars) {
            return [specialChars[this.currChar], this.line, this.col];
        }
    },

    COMMENT: function () {
        if (this.currChar === '/' && this.nextChar === '*') {
            var token = [t.COMMENT, this.line, this.col, ''];

            this.next();

            while (this.next() && (this.currChar !== '*' || this.nextChar !== '/')) {
                token[3] += this.currChar;
            }

            this.next();

            return token;
        }
    },

    NUMBER: function () {
        if (
            isDigit(this.currChar)
             || ((this.currChar === '+' || this.currChar === '-') && ((this.nextChar === '.' && isDigit(this.nextNextChar)) || isDigit(this.nextChar)))
             || ((this.currChar === '.') && isDigit(this.nextChar))
        ) {
            var token = [t.NUMBER, this.line, this.col, this.currChar];

            while ((this.nextChar === '.' || isDigit(this.nextChar)) && this.next()) {
                token[3] += this.currChar;
            }

            //normalize "(+|-).n"
            if (token[3][0] === '.') {
                token[3] = '0' + token[3];
            } else if ((token[3][0] === '+' || token[3][0] === '-') && token[3][1] === '.') {
                token[3] = token[3][0] + '0' + token[3].substr(1);
            }

            //convert to float
            token[3] = parseFloat(token[3]);

            return token;
        }
    },

    STRING: function () {
        if (this.currChar === '"' || this.currChar === "'") {
            var quote = this.currChar;
            var token = [t.STRING, this.line, this.col, ''];

            while (this.next() && this.currChar !== quote) {
                token[3] += this.currChar;
            }

            return token;
        }
    },

    NAME: function () {
        if (isEscaped(this.currChar, this.nextChar) || (isName(this.currChar) && (this.currChar !== '-' || (isName(this.nextChar) && !isDigit(this.nextChar))))) {
            var token = [t.NAME, this.line, this.col, this.currChar];

            if (this.currChar === '\\') {
                this.next()
                token[3] += this.currChar;
            }

            while ((isEscaped(this.nextChar, this.nextNextChar) || isName(this.nextChar)) && this.next()) {
                token[3] += this.currChar;

                if (this.currChar === '\\') {
                    this.next()
                    token[3] += this.currChar;
                }
            }

            return token;
        }
    },

    HASH: function () {
        if (this.currChar === '#') {
            var token = [t.HASH, this.line, this.col, ''];
            
            while ((isEscaped(this.nextChar, this.nextNextChar) || isName(this.nextChar)) && this.next()) {
                token[3] += this.currChar;

                if (this.currChar === '\\') {
                    this.next()
                    token[3] += this.currChar;
                }
            }

            return token;
        }
    }
};

function isName(code) {
    var n = code.charCodeAt(0);

    return n === 0x2d                //-
        || n === 0x5f                //_ 
        || (n >= 0x30 && n <= 0x39)  //digit
        || (n >= 0x41 && n <= 0x5a)  //uppercase
        || (n >= 0x61 && n <= 0x7a)  //lowercase
        || (n >= 0x80); //nonascii
}

function isDigit(code) {
    var n = code.charCodeAt(0);

    return n >= 0x30 && n <= 0x39;
}

function isLetter(code) {
    var n = code.charCodeAt(0);

    //upper or lowercase
    return (n >= 0x41 && n <= 0x5a) || (n >= 0x61 && n <= 0x7a);
}

function isEscaped(code1, code2) {
    if (code1 !== '\\') {
        return false;
    }

    if (code2 === '\n') {
        return false;
    }

    return true;
}

(function (stylecow) {
    stylecow.Tokens = t;
})(require('./index'));
