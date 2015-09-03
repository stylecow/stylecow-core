"use strict";

var stylecow = require('../index');
var NodeCollectionName = require('./node-collection-name');
var NodeVendor = require('./node-vendor');

/**
 * Class with common methods for nodes with vendors that behaves like collections
 */
class NodeCollectionVendor extends NodeCollectionName {

	clone (data) {
		var clone = new stylecow[this.class]();

		if (data !== true) {
			clone.data = this.data;
		}

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