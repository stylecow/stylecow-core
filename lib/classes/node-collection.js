"use strict";

var stylecow = require('../index');
var Node = require('./node');
var Collection = require('./collection');

/**
 * Class with common methods for nodes that behaves like collections
 */
class NodeCollection extends mix(Collection, Node) {

	constructor(type, className) {
		super();

		this.type = type;
		this.class = className || type;
		this.data = {};
	}

	clone (data) {
		var clone = new stylecow[this.class]();

		if (data !== true) {
			clone.data = this.data;
		}

		for (var i = 0, t = this.length; i < t; ++i) {
			clone.push(this[i].clone(data));
		};

		return clone;
	}

	empty () {
		this.splice(0);

		return this;
	}

	push (child) {
		if (child.parent) {
			child.detach();
		}

		child.parent = this;

		return Array.prototype.push.call(this, child);
	}

	add (child) {
		this.push(child);

		return this;
	}

	unshift (child) {
		if (child.parent) {
			child.detach();
		}

		child.parent = this;

		return Array.prototype.unshift.call(this, child);
	}

	splice (start, deleteCount, child) {
		if (!child) {
			return Array.prototype.splice.call(this, start, deleteCount);
		}

		if (child.parent) {
			child.detach();
		}

		child.parent = this;

		return Array.prototype.splice.call(this, start, deleteCount, child);
	}

	remove () {
		this.detach();

		for (var i = 0, t = this.length; i < t; ++i) {
			this[i].parent = null;
			this[i].remove();
		};

		this.splice(0);

		return this;
	}
}

function mix(Class1, Class2) {
	class Mixed extends Class1 {}

	Object.getOwnPropertyNames(Class2.prototype).forEach(function (prop) {
		Mixed.prototype[prop] = Class2.prototype[prop];
	});

	return Mixed;
};

module.exports = NodeCollection;
