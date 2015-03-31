var t = function (code) {
    this.code = code;
    this.tokens = [];

    this.currChar;
    this.nextChar;

    this.pos = 0;
    this.col = 0;
    this.line = 1;
};

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
t.HASH                  = 26; //#
t.NAME                  = 27;
t.EXCLAMATION           = 28; //!
t.AMPERSAND             = 29; //&
t.SOLIDUS               = 30; ///
t.UNKNOWN               = 31;

t.tokenToString = function (token) {
    return [
        '<EOF>',
        ' ',
        ':',
        ';',
        ',',
        '[',
        ']',
        '{',
        '}',
        '(',
        ')',
        '@',
        '=',
        '$',
        '+',
        '-',
        '.',
        '<',
        '>',
        '*',
        '|',
        '~',
        null,
        null,
        '%',
        null,
        '#',
        null,
        '!',
        '&',
        '/',
        null
    ][token[0]] || token[3];
};

t.prototype = {
    next: function () {
        this.currChar = this.nextChar;
        this.nextChar = this.code.charAt(this.pos++);

        //handle breaklines
        if (this.nextChar === '\r') {
            if (this.code.charAt(this.pos + 1) === '\n') {
                ++this.pos;
            }

            this.nextChar = '\n';
        } else if (this.nextChar === '\f') {
            this.nextChar = '\n';
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

    run: function () {
        this.next();
        this.next();
        this.col = 0;

        do {
               this.WHITESPACE()
            || this.NUMBER()
            || this.NAME()
            || this.COLON()
            || this.SEMICOLON()
            || this.OPEN_SQUARE_BRACKET()
            || this.CLOSE_SQUARE_BRACKET()
            || this.OPEN_CURLY_BRACKET()
            || this.CLOSE_CURLY_BRACKET()
            || this.OPEN_PARENTHESIS()
            || this.CLOSE_PARENTHESIS()
            || this.AT()
            || this.DOLLAR()
            || this.EQUALS()
            || this.STOP()
            || this.PLUS()
            || this.MINUS()
            || this.LESS_THAN()
            || this.GREATER_THAN()
            || this.ASTERISK()
            || this.VERTICAL_LINE()
            || this.TILDE()
            || this.COMMA()
            || this.PERCENTAGE()
            || this.HASH()
            || this.STRING()
            || this.EXCLAMATION()
            || this.COMMENT()
            || this.AMPERSAND()
            || this.SOLIDUS()
            || this.ERROR();
        } while (this.next());

        this.tokens.push([t.EOF, this.col, this.line]);
    },

    ERROR: function () {
        this.tokens.push([t.UNKNOWN, this.col, this.line]);
        console.error('Unespected character "' + this.currChar + '" (' + this.currChar.charCodeAt(0) + ') in line: ' + this.line + ' column: ' + this.col);
    },

    WHITESPACE: function () {
        if (this.currChar === ' ' || this.currChar === '\t' || this.currChar === '\n') {
            this.tokens.push([t.WHITESPACE, this.col, this.line]);

            while (this.nextChar === ' ' || this.nextChar === '\t' || this.nextChar === '\n') {
                this.next();
            }
            return true;
        }
    },

    COLON: function () {
        if (this.currChar === ':') {
            this.tokens.push([t.COLON, this.col, this.line]);
            return true;
        }
    },

    SEMICOLON: function () {
        if (this.currChar === ';') {
            this.tokens.push([t.SEMICOLON, this.col, this.line]);
            return true;
        }
    },

    COMMA: function () {
        if (this.currChar === ',') {
            this.tokens.push([t.COMMA, this.col, this.line]);
            return true;
        }
    },

    OPEN_SQUARE_BRACKET: function () {
        if (this.currChar === '[') {
            this.tokens.push([t.OPEN_SQUARE_BRACKET, this.col, this.line]);
            return true;
        }
    },

    CLOSE_SQUARE_BRACKET: function () {
        if (this.currChar === ']') {
            this.tokens.push([t.CLOSE_SQUARE_BRACKET, this.col, this.line]);
            return true;
        }
    },

    OPEN_CURLY_BRACKET: function () {
        if (this.currChar === '{') {
            this.tokens.push([t.OPEN_CURLY_BRACKET, this.col, this.line]);
            return true;
        }
    },

    CLOSE_CURLY_BRACKET: function () {
        if (this.currChar === '}') {
            this.tokens.push([t.CLOSE_CURLY_BRACKET, this.col, this.line]);
            return true;
        }
    },

    OPEN_PARENTHESIS: function () {
        if (this.currChar === '(') {
            this.tokens.push([t.OPEN_PARENTHESIS, this.col, this.line]);
            return true;
        }
    },

    CLOSE_PARENTHESIS: function () {
        if (this.currChar === ')') {
            this.tokens.push([t.CLOSE_PARENTHESIS, this.col, this.line]);
            return true;
        }
    },

    SOLIDUS: function () {
        if (this.currChar === '/') {
            this.tokens.push([t.SOLIDUS, this.col, this.line]);
            return true;
        }
    },

    AT: function () {
        if (this.currChar === '@') {
            this.tokens.push([t.AT, this.col, this.line]);
            return true;
        }
    },

    DOLLAR: function () {
        if (this.currChar === '$') {
            this.tokens.push([t.DOLLAR, this.col, this.line]);
            return true;
        }
    },

    AMPERSAND: function () {
        if (this.currChar === '&') {
            this.tokens.push([t.AMPERSAND, this.col, this.line]);
            return true;
        }
    },

    EQUALS: function () {
        if (this.currChar === '=') {
            this.tokens.push([t.EQUALS, this.col, this.line]);
            return true;
        }
    },

    STOP: function () {
        if (this.currChar === '.') {
            this.tokens.push([t.STOP, this.col, this.line]);
            return true;
        }
    },

    PLUS: function () {
        if (this.currChar === '+') {
            this.tokens.push([t.PLUS, this.col, this.line]);
            return true;
        }
    },

    MINUS: function () {
        if (this.currChar === '-') {
            this.tokens.push([t.MINUS, this.col, this.line]);
            return true;
        }
    },

    LESS_THAN: function () {
        if (this.currChar === '<') {
            this.tokens.push([t.LESS_THAN, this.col, this.line]);
            return true;
        }
    },

    GREATER_THAN: function () {
        if (this.currChar === '>') {
            this.tokens.push([t.GREATER_THAN, this.col, this.line]);
            return true;
        }
    },

    ASTERISK: function () {
        if (this.currChar === '*') {
            this.tokens.push([t.ASTERISK, this.col, this.line]);
            return true;
        }
    },

    VERTICAL_LINE: function () {
        if (this.currChar === '|') {
            this.tokens.push([t.VERTICAL_LINE, this.col, this.line]);
            return true;
        }
    },

    TILDE: function () {
        if (this.currChar === '~') {
            this.tokens.push([t.TILDE, this.col, this.line]);
            return true;
        }
    },

    PERCENTAGE: function () {
        if (this.currChar === '%') {
            this.tokens.push([t.PERCENTAGE, this.col, this.line]);
            return true;
        }
    },

    HASH: function () {
        if (this.currChar === '#') {
            this.tokens.push([t.HASH, this.col, this.line]);
            return true;
        }
    },

    EXCLAMATION: function () {
        if (this.currChar === '!') {
            this.tokens.push([t.EXCLAMATION, this.col, this.line]);
            return true;
        }
    },

    COMMENT: function () {
        if (this.currChar === '/' && this.nextChar === '*') {
            var token = [t.COMMENT, this.col, this.line, ''];

            this.next();

            while (this.next() && this.currChar !== '*' && this.nextChar !== '/') {
                token[3] += this.currChar;
            }

            this.next();

            this.tokens.push(token);
            return true;
        }
    },

    NUMBER: function () {
        if (isDigit(this.currChar) || ((this.currChar === '+' || this.currChar === '-' || this.currChar === '.') && isDigit(this.nextChar))) {
            var token = [t.NUMBER, this.col, this.line, this.currChar];

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

            this.tokens.push(token);
            return true;
        }
    },

    STRING: function () {
        if (this.currChar === '"' || this.currChar === "'") {
            var quote = this.currChar;
            var token = [t.STRING, this.col, this.line, ''];

            while (this.next() && this.currChar !== quote) {
                token[3] += this.currChar;
            }

            this.tokens.push(token);
            return true;
        }
    },

    NAME: function () {
        if (isName(this.currChar)) {
            var token = [t.NAME, this.col, this.line, this.currChar];

            while (isName(this.nextChar) && this.next()) {
                token[3] += this.currChar;
            }

            this.tokens.push(token);
            return true;
        }
    }
};

function isName(code) {
    return (code === '-' || code === '_' || isDigit(code) || isLetter(code));
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

(function (stylecow) {
    stylecow.Tokens = t;
})(require('./index'));
