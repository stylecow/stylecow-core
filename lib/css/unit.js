import NodeCollectionName from "./classes/node-collection-name.js";
import Number from "./number.js";

const NUMBER = Symbol.for("NUMBER");
const NAME = Symbol.for("NAME");
const PERCENTAGE = Symbol.for("PERCENTAGE");

export default class Unit extends NodeCollectionName {
  static create(reader, parent) {
    if (reader.currToken === NUMBER && !reader.nextSpace) {
      let element;

      if (reader.nextToken === NAME) {
        element = (new Unit(reader.data())).setName(reader.nextStr);
      } else if (reader.nextToken === PERCENTAGE) {
        element = (new Unit(reader.data())).setName("%");
      } else {
        return;
      }

      element.push(Number.create(reader, element) || reader.error());
      reader.move();

      return element;
    }
  }

  constructor(data) {
    super(data, "Unit");
  }

  toString() {
    return this.join("") + this.name;
  }

  toCode(code) {
    this.forEach((child) => child.toCode(code));
    code.append(this.name, this);
  }
}
