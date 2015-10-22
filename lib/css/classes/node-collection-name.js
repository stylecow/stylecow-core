"use strict";

/**
 * Class with common methods for named nodes that behaves like collections
 */
class NodeCollectionName extends require('./node-collection') {

    clone (data) {
        let clone = super.clone(data);

        clone.name = this.name;

        return clone;
    }

    setName (name) {
        this.name = name;

        return this;
    }
}

module.exports = NodeCollectionName;