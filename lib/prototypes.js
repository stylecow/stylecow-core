(function (stylecow) {

	stylecow.prototypes = {};

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
	var BasicPrototype = {
		set: function (name, value) {
			this[name] = value;

			return this;
		},

		is: function (match) {
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
		},

		parent: function (match) {
			if (this._parent) {
				if (!match || this._parent.is(match)) {
					return this._parent;
				}

				return this._parent.parent(match);
			}
		},

		setSource: function (token) {
			this.data = {
				line: token.currToken[1],
				col: token.currToken[2]
			};

			return this;
		},

		getData: function (key) {
			if (key in this.data) {
				return this.data[key];
			}

			if (this._parent) {
				return this._parent.getData(key);
			}
		},

		setData: function (key, value) {
			this.data[key] = value;

			return this;
		},

		index: function () {
			if (this._parent) {
				return this._parent.indexOf(this);
			}

			return -1;
		},

		next: function () {
			var index = this.index();

			if (index !== -1) {
				return this._parent[index + 1];
			}
		},

		prev: function () {
			var index = this.index();

			if (index > 0) {
				return this._parent[index - 1];
			}
		},

		before: function (child) {
			var index = this.index();

			if (index !== -1) {
				return this._parent.splice(index, 0, child);
			}
		},

		after: function (child) {
			var index = this.index();

			if (index !== -1) {
				if (index === this._parent.length) {
					return this._parent.push(child);
				}

				return this._parent.splice(index + 1, 0, child);
			}
		},

		replaceWith: function (child) {
			var index = this.index();

			if (index !== -1) {
				var parent = this._parent;
				this.remove();

				return parent.splice(index, 0, child);
			}
		},

		remove: function () {
			return this.detach();
		},

		detach: function () {
			if (this._parent) {
				var index = this.index();

				if (index !== -1) {
					this._parent.splice(index, 1);
					this._parent = null;
				}
			}

			return this;
		},

		toAst: function () {
			var object = {
				class: this.class
			};

			if ('name' in this) {
				object.name = this.name;
			}

			if ('vendor' in this) {
				object.vendor = this.vendor;
			}

			object.data = this.data;

			if (this.forEach !== undefined) {
				object.children = [];

				this.forEach(function (child) {
					object.children.push(child.toAst());
				});
			}

			return object;
		}
	};

	/**
	 * Node prototype used by all basic elements
	 */
	stylecow.prototypes.Node = mix({}, BasicPrototype, {
		clone: function () {
			var clone = new stylecow[this.class]();

			clone.data = this.data;

			return clone;
		}
	});


	/**
	 * Node prototype used by all elements with a name
	 */
	stylecow.prototypes.NodeWithName = mix({}, BasicPrototype, {
		clone: function () {
			var clone = new stylecow[this.class]();

			clone.name = this.name;
			clone.data = this.data;

			return clone;
		},

		toString: function () {
			return this.name;
		}
	});


	/**
	 * Node prototype used by all elements with a name and vendor prefix
	 */
	stylecow.prototypes.NodeWithNameAndVendor = mix({}, BasicPrototype, {
		setNameWithVendor: function (name) {
			if (name[0] === '-') {
				var match = name.match(/^(-(\w+)-)?(.+)$/);
				this.vendor = match[2];
				this.name = match[3];
			} else {
				this.vendor = null;
				this.name = name;
			}

			return this;
		},

		getNameWithVendor: function (name) {
			if (this.vendor) {
				return '-' + this.vendor + '-' + this.name;
			}

			return this.name;
		},

		clone: function () {
			var clone = new stylecow[this.class]();

			clone.name = this.name;
			clone.vendor = this.vendor;
			clone.data = this.data;

			return clone;
		},

		toString: function () {
			return this.getNameWithVendor();
		}
	});

	/**
	 * Node prototype used by all nodes with children
	 */
	stylecow.prototypes.NodeCollection = Object.create(Collection.prototype);
	mix(stylecow.prototypes.NodeCollection, BasicPrototype, {
		empty: function () {
			this.splice(0);

			return this;
		},

		push: function () {
			prepareChildren(this, arguments, 0);

			return Array.prototype.push.apply(this, arguments);
		},

		unshift: function () {
			prepareChildren(this, arguments, 0);

			return Array.prototype.unshift.apply(this, arguments);
		},

		splice: function () {
			if (arguments.length > 2) {
				prepareChildren(this, arguments, 2);
			}

			return Array.prototype.splice.apply(this, arguments);
		},

		remove: function () {
			this.detach();

			this.forEach(function (child) {
				child._parent = null;
				child.remove();
			});

			this.splice(0);

			return this;
		},

		clone: function () {
			var clone = new stylecow[this.class]();

			clone.data = this.data;

			this.forEach(function (child) {
				clone.push(child.clone());
			});

			return clone;
		}
	});


	/**
	 * Node prototype used by all nodes with children and a name
	 */
	stylecow.prototypes.NodeCollectionWithName = Object.create(Collection.prototype);
	mix(stylecow.prototypes.NodeCollectionWithName, BasicPrototype, {
		clone: function () {
			var clone = new stylecow[this.class]();

			clone.data = this.data;
			clone.name = this.name;

			this.forEach(function (child) {
				clone.push(child.clone());
			});

			return clone;
		}
	});

	/**
	 * Node prototype used by all nodes with children, a name and a vendor prefix
	 */
	stylecow.prototypes.NodeCollectionWithNameAndVendor = Object.create(Collection.prototype);
	mix(stylecow.prototypes.NodeCollectionWithNameAndVendor, BasicPrototype, {
		setNameWithVendor: stylecow.prototypes.NodeWithNameAndVendor.setNameWithVendor,
		getNameWithVendor: stylecow.prototypes.NodeWithNameAndVendor.getNameWithVendor,
		
		clone: function () {
			var clone = new stylecow[this.class]();

			clone.data = this.data;
			clone.name = this.name;
			clone.vendor = this.vendor;

			this.forEach(function (child) {
				clone.push(child.clone());
			});

			return clone;
		}
	});

	function mix (target) {
		Array.prototype.slice.call(arguments, 1).forEach(function (object) {
			Object.keys(object).forEach(function (i) {
				target[i] = object[i];
			});
		});

		return target;
	}

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

})(require('./index'));
