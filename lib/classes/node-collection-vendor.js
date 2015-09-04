"use strict";

var NodeVendor = require('./node-vendor');

/**
 * Class with common methods for nodes with vendors that behaves like collections
 */
class NodeCollectionVendor extends require('./node-collection-name') {

	clone (data) {
		var clone = new this.constructor(data || this.data);

		clone.name = this.name;
		clone.vendor = this.vendor;

		for (var i = 0, t = this.length; i < t; ++i) {
			clone.push(this[i].clone(data));
		};

		return clone;
	}
}

NodeCollectionVendor.prototype.setNameWithVendor = NodeVendor.prototype.setNameWithVendor;
NodeCollectionVendor.prototype.getNameWithVendor = NodeVendor.prototype.getNameWithVendor;
NodeCollectionVendor.prototype.setVendor = NodeVendor.prototype.setVendor;

module.exports = NodeCollectionVendor;