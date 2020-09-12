import NodeCollectionVendor from "./classes/node-collection-vendor.js";
import Value from "./value.js";
import String from "./string.js";
import IdSelector from "./id-selector.js";

const NAME = Symbol.for("NAME");
const OPEN_PARENTHESIS = Symbol.for("OPEN_PARENTHESIS");
const CLOSE_PARENTHESIS = Symbol.for("CLOSE_PARENTHESIS");
const COMMA = Symbol.for("COMMA");
const STRING = Symbol.for("STRING");

export default class Function extends NodeCollectionVendor {
  static create(reader, parent) {
    if (reader.currToken === NAME && reader.nextToken === OPEN_PARENTHESIS) {
      const element = (new Function(reader.data())).setNameWithVendor(
        reader.getStringAndMove(),
      );
      let value;

      reader.move();

      switch (element.name) {
        case "url":
        case "url-prefix":
        case "domain":
          value = new Value();
          element.push(value);

          // url("address")
          if (reader.currToken === STRING) {
            value.push(String.create(reader, element) || reader.error());

            // url(address)
          } else if (reader.currToken !== CLOSE_PARENTHESIS) {
            let url = (new String(reader.data())).setName("");

            do {
              url.name += reader.currStr;
            } while (reader.move() && reader.currToken !== CLOSE_PARENTHESIS);

            value.push(url);
          }
          break;

        case "element":
          value = new Value();
          element.push(value);
          value.push(IdSelector.create(reader, element) || reader.error());
          break;

        default:
          do {
            element.push(Value.create(reader, element) || reader.error());
          } while (reader.skip(COMMA));
          break;
      }

      reader.skip(CLOSE_PARENTHESIS) || reader.error();

      return element;
    }
  }

  static createUrl(reader, fromString, names) {
    names = names || ["url"];

    //"address"
    if (fromString && reader.currToken === STRING) {
      const element = (new Function(reader.data())).setName("url");

      element.push(String.create(reader, element) || reader.error());

      return element;
    }
  }

  constructor(data) {
    super(data, "Function");
  }

  toString() {
    return this.getNameWithVendor() + "(" + this.join(", ") + ")";
  }

  toCode(code) {
    code.append(this.getNameWithVendor() + "(", this);
    code.appendStyle("function-opening-parenthesis-after");

    const latest = this.length - 1;

    this.forEach(function (child, k) {
      child.toCode(code);

      if (k !== latest) {
        code.appendStyle("function-comma-before");
        code.append(",");
        code.appendStyle("function-comma-after");
      }
    });

    code.appendStyle("function-closing-parenthesis-before");
    code.append(")");
  }
}
