import NodeName from "./classes/node-name.js";

const HASH = Symbol.for("HASH");

export default class IdSelector extends NodeName {
  static create(reader, parent) {
    if (reader.currToken === HASH) {
      return (new IdSelector(reader.data())).setName(
        reader.getStringAndMove().substr(1),
      );
    }
  }

  constructor(data) {
    super(data, "IdSelector");
  }

  toString() {
    return "#" + this.name;
  }
}
