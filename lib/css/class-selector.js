import NodeName from "./classes/node-name.js";

const STOP = Symbol.for("STOP");
const NAME = Symbol.for("NAME");

export default class ClassSelector extends NodeName {
  static create(reader, parent) {
    if (reader.currToken === STOP && reader.nextToken === NAME) {
      reader.move();

      return (new ClassSelector(reader.data()))
        .setName(reader.getStringAndMove());
    }
  }

  constructor(data) {
    super(data, "ClassSelector");
  }

  toString() {
    return "." + this.name;
  }
}
