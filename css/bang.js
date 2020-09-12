import NodeName from "./classes/node-name.js";

const EXCLAMATION = Symbol.for("EXCLAMATION");
const NAME = Symbol.for("NAME");
const COMMENT = Symbol.for("COMMENT");

export default class Bang extends NodeName {
  static create(reader, parent) {
    if (reader.currToken === EXCLAMATION) {
      reader.move();

      reader.skipAll(COMMENT);

      if (reader.currToken !== NAME) {
        reader.error();
      }

      return (new Bang(reader.data())).setName(reader.getStringAndMove());
    }
  }

  constructor(data) {
    super(data, "Bang");
  }

  toString() {
    return "!" + this.name;
  }
}
