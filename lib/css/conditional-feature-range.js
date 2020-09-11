import NodeCollection from "./classes/node-collection.js";
import Keyword from "./keyword.js";
import Ratio from "./ratio.js";
import Unit from "./unit.js";
import Number from "./number.js";
import Comparator from "./comparator.js";

const CLOSE_PARENTHESIS = Symbol.for("CLOSE_PARENTHESIS");
const EOF = Symbol.for("EOF");

export default class ConditionalFeatureRange extends NodeCollection {
  static create(reader, parent) {
    const element = new ConditionalFeatureRange(reader.data());

    do {
      element.push(
        Keyword.create(reader, element) ||
          Ratio.create(reader, element) ||
          Unit.create(reader, element) ||
          Number.create(reader, element) ||
          Comparator.create(reader, element) ||
          reader.error(),
      );
    } while (
      reader.currToken !== CLOSE_PARENTHESIS && reader.currToken !== EOF
    );

    return element;
  }

  constructor(data) {
    super(data, "ConditionalFeatureRange");
  }

  toString() {
    return this.join(" ");
  }

  toCode(code) {
    this.forEach((child) => child.toCode(code));
  }
}
