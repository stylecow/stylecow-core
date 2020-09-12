import NodeVendor from "./classes/node-vendor.js";

const COLON = Symbol.for("COLON");
const NAME = Symbol.for("NAME");

export default class PseudoClass extends NodeVendor {
  static create(reader, parent) {
    if (reader.currToken === COLON && reader.nextToken === NAME) {
      reader.move();

      return (new PseudoClass(reader.data())).setNameWithVendor(
        reader.getStringAndMove(),
      );
    }
  }

  constructor(data) {
    super(data, "PseudoClass");
  }

  toString() {
    return ":" + this.getNameWithVendor();
  }
}
