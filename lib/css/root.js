import NodeCollection from "./classes/node-collection.js";
import AtRule from "./at-rule.js";
import NestedAtRule from "./nested-at-rule.js";
import Comment from "./comment.js";
import Rule from "./rule.js";

const EOF = Symbol.for("EOF");

export default class Root extends NodeCollection {
  static create(reader, parent) {
    const element = new Root(reader.data());

    while (reader.currToken !== EOF) {
      element.push(
        AtRule.create(reader, element) ||
          NestedAtRule.create(reader, element) ||
          Comment.create(reader, element) ||
          Rule.create(reader, element) ||
          reader.error(),
      );
    }

    return element;
  }

  constructor(data) {
    super(data, "Root");
  }

  toString() {
    return this
      .map((child) => child.toString())
      .filter((string) => string ? true : false)
      .join("\n");
  }

  toCode(code) {
    this.forEach((child) => child.toCode(code));
  }
}
