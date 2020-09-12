import NodeName from "./classes/node-name.js";

const HASH = Symbol.for("HASH");

export default class Hex extends NodeName {
  static create(reader, parent) {
    if (reader.currToken === HASH) {
      if (/^#[0-9a-fA-F]+$/.test(reader.currStr)) {
        return (new Hex(reader.data())).setName(
          reader.getStringAndMove().substr(1),
        );
      }

      reader.error();
    }
  }

  constructor(data) {
    super(data, "Hex");
  }

  toString() {
    return "#" + this.name;
  }
}
