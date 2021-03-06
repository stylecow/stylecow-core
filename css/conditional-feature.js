import NodeCollectionVendor from "./classes/node-collection-vendor.js";
import Value from "./value.js";

const NAME = Symbol.for("NAME");
const COLON = Symbol.for("COLON");
const COMMA = Symbol.for("COMMA");

export default class ConditionalFeature extends NodeCollectionVendor {
  static create(reader, parent) {
    if (reader.currToken === NAME && reader.nextToken === COLON) {
      const element = (new ConditionalFeature(reader.data()))
        .setNameWithVendor(reader.getStringAndMove());

      reader.move();

      do {
        element.push(Value.create(reader, element) || reader.error());
      } while (reader.skip(COMMA));

      return element;
    }
  }

  constructor(data) {
    super(data, "ConditionalFeature");
  }

  toString() {
    return this.getNameWithVendor() + ": " + this.join(" ");
  }

  toCode(code) {
    code.append(this.getNameWithVendor(), this);

    code.appendStyle("declaration-colon-before");
    code.append(":");
    code.appendStyle("declaration-colon-after");

    const latest = this.length - 1;

    this.forEach(function (child, k) {
      child.toCode(code);

      if (k !== latest) {
        code.append(" ");
      }
    });
  }
}
