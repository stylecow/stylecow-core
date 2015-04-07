(function (stylecow) {
	stylecow.prototypes = stylecow.prototypes || {};

	/**
	 * Collection class, to filter and traverse into the css tree
	 */
	var Collection = function () {};

	Collection.prototype = Object.create(Array.prototype, {
		children: {
			value: function (match) {
				var result = new Collection();

				for (var i = 0, t = this.length; i < t; ++i) {
					if (this[i].is(match)) {
						result.push(this[i]);
					}
				};

				return result;
			}
		},

		child: {
			value: function (match) {
				for (var i = 0, t = this.length; i < t; ++i) {
					if (this[i].is(match)) {
						return this[i];
					}
				};
			}
		},

		hasChild: {
			value: function (match) {
				return this.some(function (child) {
					return child.is(match);
				});
			}
		},

		get: {
			value: function (match) {
				for (var i = 0, t = this.length; i < t; i++) {
					if (this[i].is(match)) {
						return this[i];
					}

					var found = this[i].searchFirst(match);

					if (found) {
						return found;
					}
				}
			}
		},

		getAll: {
			value: function (match, result) {
				result = result || new Collection();

				for (var i = 0, t = this.length; i < t; i++) {
					if (this[i].is(match)) {
						result.push(this[i]);
					}
					
					this[i].search(match, result);
				}

				return result;
			}
		},

		contains: {
			value: function (match) {
				for (var i = 0, t = this.length; i < t; i++) {
					if (this[i].is(match) || this[i].contains(match)) {
						return true;
					}
				}

				return false;
			}
		},

		toArray: {
			value: function () {
				return this.map(function (child) {
					return child.toString();
				});
			}
		}
	});


	/**
	 * Base method inherited by all css nodes
	 */
	var Base = {
		clone: {
			value: function () {
				var clone = new stylecow[this.class]();

				clone.data = this.data;

				return clone;
			}
		},

		toAst: {
			value: function () {
				var object = {
					type: this.type,
					class: this.class,
					//data: this.data,
					children: this.map(function (child) {
						return child.toAst();
					})
				};

				if ('name' in this) {
					object.name = this.name;

					if ('vendor' in this) {
						object.vendor = this.vendor;
					}
				}

				return object;
			}
		},

		set: {
			value: function (name, value) {
				this[name] = value;

				return this;
			}
		},

		is: {
			value: function (match) {
				if (!match) {
					return true;
				}

				if (match instanceof Function) {
					return match.call(this);
				}

				if (Object.prototype.toString.call(match) !== '[object Object]') {
					return equals(this.type, match);
				}

				if (match.type && !equals(this.type, match.type)) {
					return false;
				}

				if (match.name && !equals(this.name, match.name)) {
					return false;
				}

				if (match.vendor && !equals(this.vendor, match.vendor)) {
					return false;
				}

				if (match.string && !equals(this.toString(), match.string)) {
					return false;
				}

				return true;
			}
		},

		parent: {
			value: function (match) {
				if (this._parent) {
					if (!match || this._parent.is(match)) {
						return this._parent;
					}

					return this._parent.parent(match);
				}
			}
		},

		getData: {
			value: function (key) {
				if (key in this.data) {
					return this.data[key];
				}

				if (this._parent) {
					return this._parent.getData(key);
				}
			}
		},

		setData: {
			value: function (key, value) {
				this.data[key] = value;

				return this;
			}
		},

		index: {
			value: function () {
				if (this._parent) {
					return this._parent.indexOf(this);
				}

				return -1;
			}
		},

		next: {
			value: function () {
				var index = this.index();

				if (index !== -1) {
					return this._parent[index + 1];
				}
			}
		},

		prev: {
			value: function () {
				var index = this.index();

				if (index > 0) {
					return this._parent[index - 1];
				}
			}
		},

		before: {
			value: function (child) {
				var index = this.index();

				if (index !== -1) {
					return this._parent.splice(index, 0, child);
				}
			}
		},

		after: {
			value: function (child) {
				var index = this.index();

				if (index !== -1) {
					if (index === this._parent.length) {
						return this._parent.push(child);
					}

					return this._parent.splice(index + 1, 0, child);
				}
			}
		},

		replaceWith: {
			value: function (child) {
				var index = this.index();

				if (index !== -1) {
					var parent = this._parent;
					this.remove();

					return parent.splice(index, 0, child);
				}
			}
		},

		remove: {
			value: function () {
				return this.detach();
			}
		},

		detach: {
			value: function () {
				if (this._parent) {
					var index = this.index();

					if (index !== -1) {
						this._parent.splice(index, 1);
						this._parent = null;
					}
				}

				return this;
			}
		}
	};

	/**
	 * Base node class used by all css elements
	 */
	var Node = function (class) {
		this.class = class;
		this.data = {};
	};

	Object.defineProperties(Node.prototype, Base);


	/**
	 * Node with a name
	 */
	var NamedNode = function (class, name) {
		Node.call(this, class);
		this.name = name;
	};

	NamedNode.prototype = Object.create(Node.prototype, {
		clone: {
			value: function () {
				var clone = new stylecow[this.class](this.name);

				clone.data = this.data;

				return clone;
			}
		},

		toString: {
			value: function () {
				return this.name;
			}
		}
	});

	/**
	 * Node with a name and vendor prefix
	 */
	var VendorNamedNode = function (class, name) {
		Node.call(this, class);
		this.setFullName(name);
	};

	VendorNamedNode.prototype = Object.create(NamedNode.prototype, {
		setFullName: {
			value: function (name) {
				if (name[0] === '-') {
					var match = name.match(/^(-(\w+)-)?(.+)$/);
					this.vendor = match[2];
					this.name = match[3];
				} else {
					this.vendor = undefined;
					this.name = name;
				}
			}
		},
		getFullName: {
			value: function (name) {
				if (this.vendor) {
					return '-' + this.vendor + '-' + this.name;
				}

				return this.name;
			}
		},
		clone: {
			value: function () {
				var clone = new stylecow[this.class]();

				clone.name = this.name;
				clone.vendor = this.vendor;
				clone.data = this.data;

				return clone;
			}
		},
		toString: {
			value: function () {
				return this.getFullName();
			}
		}
	});

	/**
	 * Node with children
	 */
	var ParentNode = function () {
		Node.call(this, class);
	};

	ParentNode.prototype = Object.create(Collection.prototype, {
		empty: {
			value: function () {
				this.splice(0);

				return this;
			}
		},

		push: {
			value: function () {
				prepareChildren(this, arguments, 0);

				return Array.prototype.push.apply(this, arguments);
			}
		},

		unshift: {
			value: function () {
				prepareChildren(this, arguments, 0);

				return Array.prototype.unshift.apply(this, arguments);
			}
		},

		splice: {
			value: function () {
				if (arguments.length > 2) {
					prepareChildren(this, arguments, 2);
				}

				return Array.prototype.splice.apply(this, arguments);
			}
		},

		remove: {
			value: function () {
				this.detach();

				this.forEach(function (child) {
					child._parent = null;
					child.remove();
				});

				this.splice(0);

				return this;
			}
		},
	});

	Object.defineProperties(ParentNode.prototype, Base);
	Object.defineProperties(ParentNode.prototype, {
		clone: {
			value: function () {
				var clone = Base.clone.call(this);

				this.forEach(function (child) {
					clone.push(child.clone());
				});

				return clone;
			}
		}
	});

	/**
	 * Named Node with children
	 */
	var ParentNamedNode = function () {
		NamedNode.call(this, class);
	};

	ParentNamedNode.prototype = Object.create(ParentNode.prototype, {
	});


	function prepareChildren (parent, children, from) {
		for (var i = children.length - 1; i >= from; i--) {
			if (children[i]._parent) {
				var index = children[i].index();

				if (index !== -1) {
					children[i]._parent.splice(index, 1);
				}
			}

			children[i]._parent = parent;
		};
	}

	function equals (value, needle) {
		if (needle === true) {
			return value ? true : false;
		}

		if (typeof needle === 'string') {
			return (needle === value);
		}

		if (needle instanceof Array) {
			return (needle.indexOf(value) !== -1);
		}

		if (needle instanceof RegExp) {
			return needle.test(value);
		}

		return true;
	}

})(require('../index'));
