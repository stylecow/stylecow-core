import NodeCollection from "./classes/node-collection.js";
import Keyword from "./keyword.js";
import ConditionalExpression from "./conditional-expression.js";

const NAME = Symbol.for("NAME");
const EOF = Symbol.for("EOF");

export default class MediaQuery extends NodeCollection {
  static create(reader, parent) {
    const element = new MediaQuery(reader.data());

    // not|only operators
    if (
      reader.currToken === NAME &&
      (reader.currStr.toLowerCase() === "only" ||
        reader.currStr.toLowerCase() === "not")
    ) {
      element.push(Keyword.create(reader, element) || reader.error());
    }

    //media type
    if (reader.currToken === NAME) {
      element.push(Keyword.create(reader, element) || reader.error());

      if (reader.currToken === NAME) {
        if (
          reader.currStr.toLowerCase() === "and" ||
          reader.currStr.toLowerCase() === "or"
        ) {
          element.push(Keyword.create(reader, element) || reader.error());
        } else {
          return reader.error();
        }
      } else {
        return element;
      }
    }

    while (reader.currToken !== EOF) {
      element.push(
        ConditionalExpression.create(reader, element) || reader.error(),
      );

      // and|or
      if (
        reader.currToken === NAME &&
        (reader.currStr.toLowerCase() === "and" ||
          reader.currStr.toLowerCase() === "or")
      ) {
        element.push(Keyword.create(reader, element) || reader.error());
      } else {
        break;
      }
    }

    return element;
  }

  constructor(data) {
    super(data, "MediaQuery");
  }

  toString() {
    return this.join(" ");
  }

  toCode(code) {
    const latest = this.length - 1;

    this.forEach(function (child, k) {
      child.toCode(code);

      if (k !== latest) {
        code.append(" ");
      }
    });
  }
}
