import NodeCollection from "./classes/node-collection.js";
import Number from "./number.js";
import Operator from "./operator.js";
import Function from "./function.js";
import Unit from "./unit.js";

const OPEN_PARENTHESIS = Symbol.for("OPEN_PARENTHESIS");
const CLOSE_PARENTHESIS = Symbol.for("CLOSE_PARENTHESIS");
const EOF = Symbol.for("EOF");

export default class Expression extends NodeCollection {
  static create(reader, parent) {
    if (reader.currToken === OPEN_PARENTHESIS) {
      const element = new Expression(reader.data());

      reader.move();

      do {
        element.push(
          Unit.create(reader, element) ||
            Number.create(reader, element) ||
            Operator.create(reader, element) ||
            Expression.create(reader, element) ||
            Function.create(reader, element) ||
            reader.error(),
        );
      } while (
        reader.currToken !== CLOSE_PARENTHESIS && reader.currToken !== EOF
      );

      reader.skip(CLOSE_PARENTHESIS) || reader.error();

      return element;
    }
  }

  constructor(data) {
    super(data, "Expression");
  }

  toString() {
    return "(" + this.join(" ") + ")";
  }

  toCode(code) {
    code.append("(");

    const latest = this.length - 1;

    this.forEach(function (child, k) {
      child.toCode(code);

      if (latest !== k) {
        code.append(" ");
      }
    });

    code.append(")");
  }
}
