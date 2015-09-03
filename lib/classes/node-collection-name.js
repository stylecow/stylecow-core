"use strict";

var stylecow = require('../index');
var NodeCollection = require('./node-collection');

/**
 * Class with common methods for named nodes that behaves like collections
 */
class NodeCollectionName extends NodeCollection {

	clone (data) {
		var clone = new stylecow[this.class]();

		if (data !== true) {
			clone.data = this.data;
		}

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