"use strict";

/**
 * Class with common methods for nodes that has names
 */
class NodeName extends require('./node') {

    clone (data) {
        let clone = super.clone(data);

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

module.exports = NodeName;