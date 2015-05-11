(function (stylecow) {

	stylecow.prototypes = {};

	/**
	 * Collection class, to filter and traverse into the css tree
	 */
	var Collection = function () {};

	Collection.prototype = Object.create(Array.prototype, {
		getChildren: {
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

		getChild: {
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

					if (this[i] instanceof Collection) {
						var found = this[i].get(match);

						if (found) {
							return found;
						}
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
					
					if (this[i] instanceof Collection) {
						this[i].getAll(match, result);
					}
				}

				return result;
			}
		},

		has: {
			value: function (match) {
				for (var i = 0, t = this.length; i < t; i++) {
					if (this[i].is(match) || (this[i] instanceof Array && this[i].has(match))) {
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
		cloneBefore: function () {
			var clone = this.clone();
			this.before(clone);
			return clone;
		},

		cloneAfter: function () {
			var clone = this.clone();
			this.after(clone);
			return clone;
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

			if (('type' in match) && !equals(this.type, match.type)) {
				return false;
			}

			if (('name' in match) && ('name' in this) && !equals(this.name, match.name)) {
				return false;
			}

			if (('vendor' in match) && ('vendor' in this) && !equals(this.vendor, match.vendor)) {
				return false;
			}

			if (('string' in match) && !equals(this.toString(), match.string)) {
				return false;
			}

			return true;
		},

		getParent: function (match) {
			if (this.parent) {
				if (!match || this.parent.is(match)) {
					return this.parent;
				}

				return this.parent.getParent(match);
			}
		},

		setSource: function (token) {
			this.data.line = token.currToken[1];
			this.data.col = token.currToken[2];
			this.data.file = token.file;

			return this;
		},

		getData: function (key) {
			if (key in this.data) {
				return this.data[key];
			}

			if (this.parent) {
				return this.parent.getData(key);
			}
		},

		getAllData: function (key, result) {
			result = result || [];

			if (key in this.data) {
				result.push(this.data[key]);
			}

			if (this.parent) {
				this.parent.getAllData(key, result);
			}

			return result;
		},

		setData: function (key, value) {
			this.data[key] = value;

			return this;
		},

		index: function () {
			if (this.parent) {
				return this.parent.indexOf(this);
			}

			return -1;
		},

		next: function () {
			var index = this.index();

			if (index !== -1) {
				return this.parent[index + 1];
			}
		},

		prev: function () {
			var index = this.index();

			if (index > 0) {
				return this.parent[index - 1];
			}
		},

		before: function (child) {
			var index = this.index();

			if (index !== -1) {
				return this.parent.splice(index, 0, child);
			}
		},

		after: function (child) {
			var index = this.index();

			if (index !== -1) {
				if (index === this.parent.length) {
					return this.parent.push(child);
				}

				return this.parent.splice(index + 1, 0, child);
			}
		},

		replaceWith: function (child) {
			var index = this.index();

			if (index !== -1) {
				var parent = this.parent;
				this.remove();

				return parent.splice(index, 0, child);
			}
		},

		remove: function () {
			return this.detach();
		},

		detach: function () {
			if (this.parent) {
				var index = this.index();

				if (index !== -1) {
					this.parent.splice(index, 1);
					this.parent = null;
				}
			}

			return this;
		},

		toAst: function () {
			var object = {
				class: this.class
			};

			if ('name' in this) {
				object.name = (this.name === undefined) ? null : this.name;
			}

			if ('vendor' in this) {
				object.vendor = (this.vendor === undefined) ? null : this.vendor;
			}

			if (this instanceof Array) {
				object.children = [];

				this.forEach(function (child) {
					object.children.push(child.toAst());
				});
			}

			return object;
		},

		getContextVendor: function () {
			if (('vendor' in this) && this.vendor) {
				return this.vendor;
			}

			if (this instanceof Collection) {
				var vendor;

				for (var i = 0, t = this.length; i < t; i++) {
					if (this[i].type !== 'Block' && this[i].type !== 'Comment') {
						vendor = this[i].getContextVendor();

						if (vendor) {
							return vendor;
						}
					}
				}
			}
		},

		normalizeVendors: function (vendor) {
			if (vendor === undefined) {
				vendor = this.getContextVendor() || null;
			}

			var k = 0;

			while (this[k]) {
				var child = this[k];

				if (child.type === 'Block') {
					child.normalizeVendors(vendor);
				} else if (child.type !== 'Comment') {
					var contextVendor = child.getContextVendor();

					if (contextVendor && vendor && (contextVendor !== vendor)) {
						child.detach();
						continue;
					}

					child.normalizeVendors(contextVendor || vendor);
				}

				++k;
			}

			return this;
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

		setName: function (name) {
			this.name = name;

			return this;
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
				this.vendor = match[2] || null;
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

		setName: function (name) {
			this.name = name;

			return this;
		},

		setVendor: function (vendor) {
			this.vendor = vendor;

			return this;
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

		push: function (child) {
			if ('parent' in child) {
				child.detach();
			}

			child.parent = this;

			return Array.prototype.push.call(this, child);
		},

		add: function (child) {
			this.push(child);

			return this;
		},

		unshift: function (child) {
			if ('parent' in child) {
				child.detach();
			}

			child.parent = this;

			return Array.prototype.unshift.call(this, child);
		},

		splice: function (start, deleteCount, child) {
			if (!child) {
				return Array.prototype.splice.call(this, start, deleteCount);
			}

			if ('parent' in child) {
				child.detach();
			}

			child.parent = this;

			return Array.prototype.splice.call(this, start, deleteCount, child);
		},

		remove: function () {
			this.detach();

			for (var i = 0, t = this.length; i < t; ++i) {
				this[i].parent = null;
				this[i].remove();
			};

			this.splice(0);

			return this;
		},

		clone: function () {
			var clone = new stylecow[this.class]();

			clone.data = this.data;

			for (var i = 0, t = this.length; i < t; ++i) {
				clone.push(this[i].clone());
			};

			return clone;
		}
	});


	/**
	 * Node prototype used by all nodes with children and a name
	 */
	stylecow.prototypes.NodeCollectionWithName = Object.create(stylecow.prototypes.NodeCollection);
	mix(stylecow.prototypes.NodeCollectionWithName, BasicPrototype, {
		setName: stylecow.prototypes.NodeWithNameAndVendor.setName,
		
		clone: function () {
			var clone = new stylecow[this.class]();

			clone.data = this.data;
			clone.name = this.name;

			for (var i = 0, t = this.length; i < t; ++i) {
				clone.push(this[i].clone());
			};

			return clone;
		}
	});

	/**
	 * Node prototype used by all nodes with children, a name and a vendor prefix
	 */
	stylecow.prototypes.NodeCollectionWithNameAndVendor = Object.create(stylecow.prototypes.NodeCollection);
	mix(stylecow.prototypes.NodeCollectionWithNameAndVendor, BasicPrototype, {
		setNameWithVendor: stylecow.prototypes.NodeWithNameAndVendor.setNameWithVendor,
		getNameWithVendor: stylecow.prototypes.NodeWithNameAndVendor.getNameWithVendor,
		setName: stylecow.prototypes.NodeWithNameAndVendor.setName,
		setVendor: stylecow.prototypes.NodeWithNameAndVendor.setVendor,
		
		clone: function () {
			var clone = new stylecow[this.class]();

			clone.data = this.data;
			clone.name = this.name;
			clone.vendor = this.vendor;

			for (var i = 0, t = this.length; i < t; ++i) {
				clone.push(this[i].clone());
			};

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
