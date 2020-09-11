import NodeVendor from "./node-vendor.js";
import NodeCollectionName from "./node-collection-name.js"

/**
 * Class with common methods for nodes with vendors that behaves like collections
 */
export default class NodeCollectionVendor extends NodeCollectionName {

    clone (data) {
        const clone = super.clone(data);

        clone.vendor = this.vendor;

        return clone;
    }
}

NodeCollectionVendor.prototype.setNameWithVendor = NodeVendor.prototype.setNameWithVendor;
NodeCollectionVendor.prototype.getNameWithVendor = NodeVendor.prototype.getNameWithVendor;
NodeCollectionVendor.prototype.setVendor = NodeVendor.prototype.setVendor;
