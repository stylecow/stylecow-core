import NodeCollectionVendor from "./classes/node-collection-vendor.js";
import Keyword from "./keyword.js";
import Selectors from "./selectors.js";
import ConditionalSelector from "./conditional-selector.js";
import MediaQueries from "./media-queries.js";
import Value from "./value.js";
import Block from "./block.js";

const AT = Symbol.for("AT");
const NAME = Symbol.for("NAME");
const OPEN_CURLY_BRACKET = Symbol.for("OPEN_CURLY_BRACKET");
const COMMA = Symbol.for("COMMA");

export default class NestedAtRule extends NodeCollectionVendor {
  static create(reader, parent) {
    if (reader.currToken === AT && reader.nextToken === NAME) {
      reader.move();

      const element = (new NestedAtRule(reader.data())).setNameWithVendor(
        reader.getStringAndMove(),
      );

      switch (element.name) {
        case "counter-style":
        case "font-feature-values":
        case "keyframes":
          element.push(Keyword.create(reader, element) || reader.error());
          break;

        case "page":
          if (reader.currToken !== OPEN_CURLY_BRACKET) {
            element.push(Selectors.create(reader, element) || reader.error());
          }
          break;

        case "nest":
          element.push(Selectors.create(reader, element) || reader.error());
          break;

        case "supports":
          element.push(
            ConditionalSelector.create(reader, element) || reader.error(),
          );
          break;

        case "media":
          element.push(MediaQueries.create(reader, element) || reader.error());
          break;

        case "document":
          do {
            element.push(Value.create(reader, element) || reader.error());
          } while (reader.currToken === COMMA && reader.move());

          break;
      }

      element.push(Block.create(reader, element) || reader.error());

      return element;
    }
  }

  constructor(data) {
    super(data, "AtRule");
  }

  isEmpty() {
    return this.getChild("Block").isEmpty();
  }

  toString() {
    if (this.name === "document") {
      return "@" + this.getNameWithVendor() + " " +
        this.getChildren("Value").join(", ") + " " +
        this.getChild("Block").toString();
    }

    return "@" + this.getNameWithVendor() + " " + this.join(" ");
  }

  toCode(code) {
    if (this.isEmpty()) {
      return;
    }

    code.appendStyle("at-rule-block-before");
    code.append("@" + this.getNameWithVendor() + " ", this);

    if (this.name === "document") {
      const values = this.getChildren("Value");
      const latest = values.length - 1;

      values.forEach(function (child, k) {
        child.toCode(code);

        if (k !== latest) {
          code.appendStyle("declaration-comma-before");
          code.append(",");
          code.appendStyle("declaration-comma-after");
        }
      });

      this.getChild("Block").toCode(code);
    } else {
      this.forEach(function (child, k) {
        child.toCode(code);
      });
    }

    code.appendStyle("at-rule-block-after");
  }
}
