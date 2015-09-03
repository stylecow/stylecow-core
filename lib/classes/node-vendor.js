"use strict";

var stylecow = require('../index');
var NodeName = require('./node-name');

/**
 * Class with common methods for nodes that have vendor prefix
 */
class NodeVendor extends NodeName {

	setNameWithVendor (name) {
		if (name[0] === '-') {
			let match = name.match(/^(-(\w+)-)?(.+)$/);
			this.vendor = match[2] || null;
			this.name = match[3];
		} else {
			this.vendor = null;
			this.name = name;
		}

		return this;
	}

	getNameWithVendor (name) {
		if (this.vendor) {
			return '-' + this.vendor + '-' + this.name;
		}

		return this.name;
	}

	setVendor (vendor) {
		this.vendor = vendor;

		return this;
	}

	clone (data) {
		var clone = new stylecow[this.class]();

		clone.name = this.name;
		clone.vendor = this.vendor;
		
		if (data !== true) {
			clone.data = this.data;
		}

		return clone;
	}

	toString () {
		return this.getNameWithVendor();
	}
}

module.exports = NodeVendor;
