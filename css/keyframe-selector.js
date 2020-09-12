import NodeCollection from "./classes/node-collection.js";
import Keyword from "./keyword.js";
import Unit from "./unit.js";
import Number from "./number.js";

const SEMICOLON = Symbol.for("SEMICOLON");
const NAME = Symbol.for("NAME");
const COMMA = Symbol.for("COMMA");

export default class KeyframeSelector extends NodeCollection {
  static create(reader, parent) {
    const element = new KeyframeSelector(reader.data());

    do {
      if (
        reader.currToken === NAME &&
        (reader.currStr === "from" || reader.currStr === "to")
      ) {
        element.push(Keyword.create(reader, element) || reader.error());
      } else {
        element.push(
          Unit.create(reader, element) ||
            Number.create(reader, element) ||
            reader.error(),
        );
      }
    } while (reader.skip(COMMA));

    return element;
  }

  constructor(data) {
    super(data, "KeyframeSelector");
  }

  toString() {
    return this.join(", ");
  }

  toCode(code) {
    const latest = this.length - 1;

    this.forEach(function (child, k) {
      child.toCode(code);

      if (k !== latest) {
        code.appendStyle("selector-comma-before");
        code.append(",");
        code.appendStyle("selector-comma-after");
      }
    });
  }
}
