import NodeCollection from "./node-collection.js";
/**
 * Class with common methods for named nodes that behaves like collections
 */
export default class NodeCollectionName extends NodeCollection {
  clone(data) {
    const clone = super.clone(data);

    clone.name = this.name;

    return clone;
  }

  setName(name) {
    this.name = name;

    return this;
  }
}
