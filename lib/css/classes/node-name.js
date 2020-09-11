import Node from "./node.js"
/**
 * Class with common methods for nodes that has names
 */
export default class NodeName extends Node {

    clone (data) {
        const clone = super.clone(data);

        clone.name = this.name;

        return clone;
    }

    setName (name) {
        this.name = name;

        return this;
    }

    toString () {
        return this.name;
    }
}
