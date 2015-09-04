"use strict";

var stylecow = require('../index');
var Node = require('./node');

/**
 * Class with common methods for nodes that has names
 */
class NodeName extends Node {

	clone (data) {
		var clone = new this.constructor(data || this.data);

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