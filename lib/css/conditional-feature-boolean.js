import NodeName from "./classes/node-name.js";

const CLOSE_PARENTHESIS = Symbol.for("CLOSE_PARENTHESIS");
const NAME = Symbol.for("NAME");

export default class ConditionalFeatureBoolean extends NodeName {
  static create(reader, parent) {
    if (reader.currToken === NAME && reader.nextToken === CLOSE_PARENTHESIS) {
      return (new ConditionalFeatureBoolean(reader.data())).setName(
        reader.getStringAndMove(),
      );
    }
  }

  constructor(data) {
    super(data, "ConditionalFeatureBoolean");
  }
}
