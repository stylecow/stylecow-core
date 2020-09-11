import NodeName from "./classes/node-name.js";

const STRING = Symbol.for("STRING");

export default class String extends NodeName {
  static create(reader, parent) {
    if (reader.currToken === STRING) {
      return (new String(reader.data())).setName(reader.getStringAndMove());
    }
  }

  constructor(data) {
    super(data, "String");
  }

  toString() {
    return '"' + this.name.replace(/(")/g, "\\$1") + '"';
  }

  toCode(code) {
    const q = code.get("string-quotes");

    code.append(
      q + this.name.replace(new RegExp("([" + q + "])", "g"), "\\$1") + q,
      this,
    );
  }
}
