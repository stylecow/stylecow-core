"use strict";

var stylecow = require('../index');
var Node = require('./node');

/**
 * Class with common methods for nodes that has names
 */
class NodeName extends Node {

	clone (data) {
		var clone = new stylecow[this.class]();

		clone.name = this.name;

		if (data !== true) {
			clone.data = this.data;
		}

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