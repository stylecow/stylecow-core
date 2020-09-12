import Node from "./classes/node.js";

const ASTERISK = Symbol.for("ASTERISK");

export default class UniversalSelector extends Node {
  static create(reader, parent) {
    if (reader.currToken === ASTERISK) {
      reader.move();

      return new UniversalSelector(reader.data());
    }
  }

  constructor(data) {
    super(data, "UniversalSelector");
  }

  toString() {
    return "*";
  }
}
