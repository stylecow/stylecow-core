const EOF = Symbol.for("EOF");
const WHITESPACE = Symbol.for("WHITESPACE");
const COLON = Symbol.for("COLON");
const SEMICOLON = Symbol.for("SEMICOLON");
const COMMA = Symbol.for("COMMA");
const OPEN_SQUARE_BRACKET = Symbol.for("OPEN_SQUARE_BRACKET");
const CLOSE_SQUARE_BRACKET = Symbol.for("CLOSE_SQUARE_BRACKET");
const OPEN_CURLY_BRACKET = Symbol.for("OPEN_CURLY_BRACKET");
const CLOSE_CURLY_BRACKET = Symbol.for("CLOSE_CURLY_BRACKET");
const OPEN_PARENTHESIS = Symbol.for("OPEN_PARENTHESIS");
const CLOSE_PARENTHESIS = Symbol.for("CLOSE_PARENTHESIS");
const AT = Symbol.for("AT");
const EQUALS = Symbol.for("EQUALS");
const DOLLAR = Symbol.for("DOLLAR");
const PLUS = Symbol.for("PLUS");
const MINUS = Symbol.for("MINUS");
const STOP = Symbol.for("STOP");
const LESS_THAN = Symbol.for("LESS_THAN");
const GREATER_THAN = Symbol.for("GREATER_THAN");
const ASTERISK = Symbol.for("ASTERISK");
const VERTICAL_LINE = Symbol.for("VERTICAL_LINE");
const TILDE = Symbol.for("TILDE");
const COMMENT = Symbol.for("COMMENT");
const NUMBER = Symbol.for("NUMBER");
const PERCENTAGE = Symbol.for("PERCENTAGE");
const STRING = Symbol.for("STRING");
const HASH = Symbol.for("HASH");
const NAME = Symbol.for("NAME");
const EXCLAMATION = Symbol.for("EXCLAMATION");
const AMPERSAND = Symbol.for("AMPERSAND");
const SOLIDUS = Symbol.for("SOLIDUS");
const CARET = Symbol.for("CARET");
const UNKNOWN = Symbol.for("UNKNOWN");

const specialChars = new Map();

specialChars.set(":", COLON);
specialChars.set(";", SEMICOLON);
specialChars.set(",", COMMA);
specialChars.set("[", OPEN_SQUARE_BRACKET);
specialChars.set("]", CLOSE_SQUARE_BRACKET);
specialChars.set("{", OPEN_CURLY_BRACKET);
specialChars.set("}", CLOSE_CURLY_BRACKET);
specialChars.set("(", OPEN_PARENTHESIS);
specialChars.set(")", CLOSE_PARENTHESIS);
specialChars.set("@", AT);
specialChars.set("=", EQUALS);
specialChars.set("$", DOLLAR);
specialChars.set("+", PLUS);
specialChars.set("-", MINUS);
specialChars.set(".", STOP);
specialChars.set("<", LESS_THAN);
specialChars.set(">", GREATER_THAN);
specialChars.set("*", ASTERISK);
specialChars.set("|", VERTICAL_LINE);
specialChars.set("~", TILDE);
specialChars.set("%", PERCENTAGE);
specialChars.set("!", EXCLAMATION);
specialChars.set("&", AMPERSAND);
specialChars.set("/", SOLIDUS);
specialChars.set("^", CARET);

export default class Tokens {
  constructor(code) {
    this.code = code;

    this.currChar;
    this.nextChar;

    this.pos = 0;
    this.col = 0;
    this.line = 1;

    this.next();
    this.next();
    this.col = 0;
  }

  next() {
    this.currChar = this.nextChar;
    this.nextChar = this.nextNextChar;
    this.nextNextChar = this.code.charAt(this.pos++);

    if (this.currChar === "\n") {
      ++this.line;
      this.col = 0;
    } else if (this.currChar === "") {
      return false;
    } else {
      ++this.col;
    }

    //handle breaklines
    if (this.nextNextChar === "\r") {
      if (this.code.charAt(this.pos + 1) === "\n") {
        ++this.pos;
      }

      this.nextNextChar = "\n";
    } else if (this.nextNextChar === "\f") {
      this.nextNextChar = "\n";
    }

    return true;
  }

  get() {
    this.next();

    return this.WHITESPACE() ||
      this.HASH() ||
      this.COMMENT() ||
      this.STRING() ||
      this.NUMBER() ||
      this.NAME() ||
      this.SPECIAL_CHAR() ||
      this.END();
  }

  END() {
    if (this.currChar === "") {
      return [EOF, this.line, this.col];
    }

    return [UNKNOWN, this.line, this.col, this.currChar];
  }

  WHITESPACE() {
    if (
      this.currChar === " " || this.currChar === "\t" || this.currChar === "\n"
    ) {
      while (
        this.nextChar === " " || this.nextChar === "\t" ||
        this.nextChar === "\n"
      ) {
        this.next();
      }

      return [WHITESPACE, this.line, this.col, " "];
    }
  }

  SPECIAL_CHAR() {
    if (specialChars.has(this.currChar)) {
      return [
        specialChars.get(this.currChar),
        this.line,
        this.col,
        this.currChar,
      ];
    }
  }

  COMMENT() {
    if (this.currChar === "/" && this.nextChar === "*") {
      const token = [COMMENT, this.line, this.col, ""];

      this.next();

      while (this.next() && (this.currChar !== "*" || this.nextChar !== "/")) {
        token[3] += this.currChar;
      }

      this.next();

      return token;
    }
  }

  NUMBER() {
    if (
      isDigit(this.currChar) ||
      ((this.currChar === "-") &&
        ((this.nextChar === "." && isDigit(this.nextNextChar)) ||
          isDigit(this.nextChar))) ||
      ((this.currChar === ".") && isDigit(this.nextChar))
    ) {
      const token = [NUMBER, this.line, this.col, this.currChar];

      while ((this.nextChar === "." || isDigit(this.nextChar)) && this.next()) {
        token[3] += this.currChar;
      }

      //normalize "(+|-).n"
      if (token[3][0] === ".") {
        token[3] = "0" + token[3];
      } else if (
        (token[3][0] === "+" || token[3][0] === "-") && token[3][1] === "."
      ) {
        token[3] = token[3][0] + "0" + token[3].substr(1);
      }

      //convert to float
      token[3] = parseFloat(token[3]);

      return token;
    }
  }

  STRING() {
    if (this.currChar === '"' || this.currChar === "'") {
      const quote = this.currChar;
      const token = [STRING, this.line, this.col, ""];

      while (this.next() && this.currChar !== quote) {
        if (this.currChar === "\\") {
          if (this.nextChar === quote) {
            this.next();
          }
          if (this.nextChar === "\\") {
            token[3] += this.currChar;
            this.next();
          }
        }

        token[3] += this.currChar;
      }

      return token;
    }
  }

  NAME() {
    if (
      isEscaped(this.currChar, this.nextChar) ||
      (isName(this.currChar) &&
        (this.currChar !== "-" ||
          (isName(this.nextChar) && !isDigit(this.nextChar))))
    ) {
      const token = [NAME, this.line, this.col, this.currChar];

      if (this.currChar === "\\") {
        this.next();
        token[3] += this.currChar;
      }

      while (
        (isEscaped(this.nextChar, this.nextNextChar) ||
          isName(this.nextChar)) && this.next()
      ) {
        token[3] += this.currChar;

        if (this.currChar === "\\") {
          this.next();
          token[3] += this.currChar;
        }
      }

      return token;
    }
  }

  HASH() {
    if (this.currChar === "#") {
      const token = [HASH, this.line, this.col, "#"];

      while (
        (isEscaped(this.nextChar, this.nextNextChar) ||
          isName(this.nextChar)) && this.next()
      ) {
        token[3] += this.currChar;

        if (this.currChar === "\\") {
          this.next();
          token[3] += this.currChar;
        }
      }

      return token;
    }
  }
}

function isName(code) {
  const n = code.charCodeAt(0);

  return n === 0x2d || //-
    n === 0x5f || //_
    (n >= 0x30 && n <= 0x39) || //digit
    (n >= 0x41 && n <= 0x5a) || //uppercase
    (n >= 0x61 && n <= 0x7a) || //lowercase
    (n >= 0x80); //nonascii
}

function isDigit(code) {
  const n = code.charCodeAt(0);

  return n >= 0x30 && n <= 0x39;
}

function isLetter(code) {
  const n = code.charCodeAt(0);

  //upper or lowercase
  return (n >= 0x41 && n <= 0x5a) || (n >= 0x61 && n <= 0x7a);
}

function isEscaped(code1, code2) {
  if (code1 !== "\\") {
    return false;
  }

  if (code2 === "\n") {
    return false;
  }

  return true;
}
