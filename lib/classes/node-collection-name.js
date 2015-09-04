"use strict";

/**
 * Class with common methods for named nodes that behaves like collections
 */
class NodeCollectionName extends require('./node-collection') {

	clone (data) {
		var clone = new this.constructor(data || this.data);

		clone.name = this.name;

		for (var i = 0, t = this.length; i < t; ++i) {
			clone.push(this[i].clone(data));
		};

		return clone;
	}

	setName (name) {
		this.name = name;

		return this;
	}
}

module.exports = NodeCollectionName;