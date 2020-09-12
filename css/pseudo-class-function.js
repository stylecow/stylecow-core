import NodeCollectionVendor from "./classes/node-collection-vendor.js";
import Selector from "./selector.js";
import Value from "./value.js";
import Keyword from "./keyword.js";
import Unit from "./unit.js";
import Number from "./number.js";
import Operator from "./operator.js";

const OPEN_PARENTHESIS = Symbol.for("OPEN_PARENTHESIS");
const CLOSE_PARENTHESIS = Symbol.for("CLOSE_PARENTHESIS");
const NAME = Symbol.for("NAME");
const COLON = Symbol.for("COLON");
const NUMBER = Symbol.for("NUMBER");
const COMMA = Symbol.for("COMMA");

export default class PseudoClassFunction extends NodeCollectionVendor {
  static create(reader, parent) {
    if (
      reader.currToken === COLON && reader.nextToken === NAME &&
      reader.nextNextToken === OPEN_PARENTHESIS
    ) {
      reader.move();

      const element = (new PseudoClassFunction(reader.data()))
        .setNameWithVendor(reader.getStringAndMove());

      reader.skip(OPEN_PARENTHESIS) || reader.error();

      //Contains selectors
      if (element.is({ name: ["not", "matches", "has"] })) {
        do {
          element.push(Selector.create(reader, element) || reader.error());
        } while (reader.currToken === COMMA && reader.move());
      } //Contains position
      else if (element.is({ name: /^(-(\w+)-)?(nth-.+)$/ })) {
        const value = new Value(reader.data());
        element.push(value);

        // odd / even
        if (
          reader.currToken === NAME &&
          (reader.currStr === "odd" || reader.currStr === "even")
        ) {
          value.push(Keyword.create(reader, element) || reader.error());
          // an+b
        } else {
          if (
            reader.currToken === NUMBER && reader.nextToken === NAME &&
            reader.nextStr === "n"
          ) {
            value.push(Unit.create(reader, element) || reader.error());
          } else if (reader.currToken === NAME && reader.currStr === "n") {
            const unit = (new Unit(reader.data())).setName(
              reader.getStringAndMove(),
            );

            unit.push((new Number(reader.data())).setName(1));

            value.push(unit);
          } else {
            value.push(Number.create(reader, element) || reader.error());
          }

          //n+1 can be tokenized as n1
          if (reader.currToken === NUMBER) {
            value.push((new Operator(reader.data())).setName("+"));
            value.push(Number.create(reader, element) || reader.error());
          } else {
            const child = Operator.create(reader, element);

            if (child) {
              value.push(child);
              value.push(Number.create(reader, element) || reader.error());
            }
          }
        }
      } //Default
      else {
        do {
          element.push(Value.create(reader, element) || reader.error());
        } while (reader.skip(COMMA));
      }

      reader.skip(CLOSE_PARENTHESIS) || reader.error();

      return element;
    }
  }

  constructor(data) {
    super(data, "PseudoClass");
  }

  toString() {
    return ":" + this.getNameWithVendor() + "(" + this.join(", ") + ")";
  }

  toCode(code) {
    code.append(":" + this.getNameWithVendor() + "(", this);
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
