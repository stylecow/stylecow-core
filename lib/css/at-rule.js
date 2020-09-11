import NodeCollectionName from "./classes/node-collection-name.js";
import String from "./string.js";
import ExtensionName from "./extension-name.js";
import MediaQueries from "./media-queries.js";
import Selectors from "./selectors.js";
import Selector from "./selector.js";
import Function from "./function.js";
import Keyword from "./keyword.js";
import Value from "./value.js";

const AT = Symbol.for("AT");
const NAME = Symbol.for("NAME");
const SEMICOLON = Symbol.for("SEMICOLON");
const OPEN_PARENTHESIS = Symbol.for("OPEN_PARENTHESIS");
const STRING = Symbol.for("STRING");

export default class AtRule extends NodeCollectionName {
  static create(reader, parent) {
    if (reader.currToken === AT && reader.nextToken === NAME) {
      let element;

      switch (reader.nextStr) {
        case "charset":
          element = create(reader);
          element.push(String.create(reader, element) || reader.error());

          reader.skip(SEMICOLON);

          return element;

        case "custom-media":
          element = create(reader);
          element.push(ExtensionName.create(reader, element) || reader.error());
          element.push(MediaQueries.create(reader, element) || reader.error());

          reader.skip(SEMICOLON);

          return element;

        case "custom-selector":
          element = create(reader);
          element.push(ExtensionName.create(reader, element) || reader.error());
          element.push(Selectors.create(reader, element) || reader.error());

          reader.skip(SEMICOLON);

          return element;

        case "apply":
          element = create(reader);
          element.push(ExtensionName.create(reader, element) || reader.error());

          reader.skip(SEMICOLON);

          return element;

        case "extend":
          element = create(reader);
          element.push(Selector.create(reader, element));

          reader.skip(SEMICOLON);

          return element;

        case "import":
          element = create(reader);

          if (reader.currToken === STRING) {
            element.push(createUrlFromString(reader));
          } else {
            element.push(Function.create(reader, element) || reader.error());
          }

          if (
            reader.currToken === NAME || reader.currToken === OPEN_PARENTHESIS
          ) {
            element.push(
              MediaQueries.create(reader, element) || reader.error(),
            );
          }

          reader.skip(SEMICOLON);

          return element;

        case "namespace":
          element = create(reader);

          if (reader.currToken === NAME) {
            element.push(Keyword.create(reader, element) || reader.error());
          }

          if (reader.currToken === STRING) {
            element.push(createUrlFromString(reader));
          } else {
            element.push(Function.create(reader, element) || reader.error());
          }

          reader.skip(SEMICOLON);

          return element;
      }
    }
  }

  constructor(data) {
    super(data, "AtRule");
  }

  toString() {
    return "@" + this.name + " " + this.join(" ") + ";";
  }

  toCode(code) {
    code.appendStyle("at-rule-inline-before");
    code.append("@" + this.name);

    this.forEach(function (child, k) {
      code.append(" ");
      child.toCode(code);
    });

    code.append(";");
    code.appendStyle("at-rule-inline-after");
  }
}

function create(reader) {
  reader.move();

  return (new AtRule(reader.data())).setName(reader.getStringAndMove());
}

function createUrlFromString(reader) {
  const element = (new Function(reader.data())).setName("url");
  const value = new Value(reader.data());
  element.push(value);
  value.push(String.create(reader, value) || reader.error());

  return element;
}
