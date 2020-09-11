import NodeCollection from "./classes/node-collection.js";
import Combinator from "./combinator.js";
import ExtensionName from "./extension-name.js";
import TypeSelector from "./type-selector.js";
import Comment from "./comment.js";
import AttributeSelector from "./attribute-selector.js";
import UniversalSelector from "./universal-selector.js";
import ClassSelector from "./class-selector.js";
import IdSelector from "./id-selector.js";
import PseudoClassFunction from "./pseudo-class-function.js";
import PseudoClass from "./pseudo-class.js";
import PseudoElement from "./pseudo-element.js";
import PlaceholderSelector from "./placeholder-selector.js";

const CLOSE_PARENTHESIS = Symbol.for("CLOSE_PARENTHESIS");
const OPEN_CURLY_BRACKET = Symbol.for("OPEN_CURLY_BRACKET");
const SEMICOLON = Symbol.for("SEMICOLON");
const COMMA = Symbol.for("COMMA");
const EOF = Symbol.for("EOF");

const AMPERSAND = Symbol.for("AMPERSAND");
const PLUS = Symbol.for("PLUS");
const GREATER_THAN = Symbol.for("GREATER_THAN");
const TILDE = Symbol.for("TILDE");

export default class Selector extends NodeCollection {
  static create(reader, parent) {
    const element = new Selector(reader.data());
    let child;

    do {
      if (
        element.length &&
        reader.currSpace &&
        (child.type !== "Combinator" || child.name === "&") &&
        reader.currToken !== PLUS &&
        reader.currToken !== GREATER_THAN &&
        reader.currToken !== TILDE
      ) {
        element.push((new Combinator(reader.data())).setName(" "));
      }

      child = Combinator.create(reader, element) ||
        ExtensionName.create(reader, element) ||
        TypeSelector.create(reader, element) ||
        Comment.create(reader, element) ||
        AttributeSelector.create(reader, element) ||
        UniversalSelector.create(reader, element) ||
        ClassSelector.create(reader, element) ||
        IdSelector.create(reader, element) ||
        PseudoClassFunction.create(reader, element) ||
        PseudoClass.create(reader, element) ||
        PseudoElement.create(reader, element) ||
        PlaceholderSelector.create(reader, element) ||
        reader.error();

      element.push(child);
    } while (
      reader.currToken !== COMMA && reader.currToken !== EOF &&
      reader.currToken !== CLOSE_PARENTHESIS &&
      reader.currToken !== OPEN_CURLY_BRACKET && reader.currToken !== SEMICOLON
    );

    return element;
  }

  constructor(data) {
    super(data, "Selector");
  }

  toString() {
    return this.join("");
  }

  toCode(code) {
    this.forEach((child) => child.toCode(code));
  }
}
