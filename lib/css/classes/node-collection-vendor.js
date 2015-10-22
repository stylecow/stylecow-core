"use strict";

let NodeVendor = require('./node-vendor');

/**
 * Class with common methods for nodes with vendors that behaves like collections
 */
class NodeCollectionVendor extends require('./node-collection-name') {

    clone (data) {
        let clone = super.clone(data);

        clone.vendor = this.vendor;

        return clone;
    }
}

NodeCollectionVendor.prototype.setNameWithVendor = NodeVendor.prototype.setNameWithVendor;
NodeCollectionVendor.prototype.getNameWithVendor = NodeVendor.prototype.getNameWithVendor;
NodeCollectionVendor.prototype.setVendor = NodeVendor.prototype.setVendor;

module.exports = NodeCollectionVendor;