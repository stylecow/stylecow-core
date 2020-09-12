import NodeVendor from "./classes/node-vendor.js";

const COLON = Symbol.for("COLON");
const NAME = Symbol.for("NAME");

export default class PseudoElement extends NodeVendor {
  static create(reader, parent) {
    if (
      reader.currToken === COLON && reader.nextToken === COLON &&
      reader.nextNextToken === NAME
    ) {
      reader.move();
      reader.move();

      return (new PseudoElement(reader.data())).setNameWithVendor(
        reader.getStringAndMove(),
      );
    }
  }

  constructor(data) {
    super(data, "PseudoElement");
  }

  toString() {
    return "::" + this.getNameWithVendor();
  }
}
