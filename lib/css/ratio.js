import NodeCollection from "./classes/node-collection.js";
import Number from "./number.js";

const NUMBER = Symbol.for("NUMBER");
const NAME = Symbol.for("NAME");
const SOLIDUS = Symbol.for("SOLIDUS");

export default class Ratio extends NodeCollection {
  static create(reader, parent) {
    if (reader.currToken === NUMBER && reader.nextToken === SOLIDUS) {
      const element = new Ratio(reader.data());

      element.push(Number.create(reader, element) || reader.error());
      reader.skip(SOLIDUS) || reader.error();
      element.push(Number.create(reader, element) || reader.error());

      return element;
    }
  }

  constructor(data) {
    super(data, "Ratio");
  }

  toString() {
    return this.join("/");
  }

  toCode(code) {
    this[0].toCode(code);
    code.append("/");
    this[1].toCode(code);
  }
}
