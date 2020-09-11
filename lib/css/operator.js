import NodeName from "./classes/node-name.js";

const PLUS = Symbol.for("PLUS");
const MINUS = Symbol.for("MINUS");
const ASTERISK = Symbol.for("ASTERISK");
const SOLIDUS = Symbol.for("SOLIDUS");

export default class Operator extends NodeName {
  static create(reader, parent) {
    if (reader.currToken === PLUS) {
      reader.move();
      return (new Operator(reader.data())).setName("+");
    }

    if (reader.currToken === MINUS) {
      reader.move();
      return (new Operator(reader.data())).setName("-");
    }

    if (reader.currToken === ASTERISK) {
      reader.move();
      return (new Operator(reader.data())).setName("*");
    }

    if (reader.currToken === SOLIDUS) {
      reader.move();
      return (new Operator(reader.data())).setName("/");
    }
  }

  constructor(data) {
    super(data, "Operator");
  }
}
