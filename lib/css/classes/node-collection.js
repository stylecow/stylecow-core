"use strict";

const stylecow = require('../../index');

/**
 * Class with common methods for nodes that behaves like collections
 */
class NodeCollection extends mix(require('./collection'), require('./node')) {

    constructor(data, type) {
        super();

        this.type = type;
        this.data = data || {};
    }

    clone (data) {
        var clone = new this.constructor(data || this.data);

        for (let i = 0, t = this.length; i < t; ++i) {
            clone.push(this[i].clone(data));
        };

        return clone;
    }

    empty () {
        this.splice(0);

        return this;
    }

    push (child) {
        if (child.hasParent()) {
            child.detach();
        }

        child.setParent(this);

        return Array.prototype.push.call(this, child);
    }

    pushCode (code, className) {
        this.push(stylecow.parse(code, className, this));
    }

    unshift (child) {
        if (child.hasParent()) {
            child.detach();
        }

        child.setParent(this);

        return Array.prototype.unshift.call(this, child);
    }

    unshiftCode (code, className) {
        this.unshift(stylecow.parse(code, className, this));
    }

    splice (start, deleteCount, child) {
        if (!child) {
            return Array.prototype.splice.call(this, start, deleteCount);
        }

        if (child.hasParent()) {
            child.detach();
        }

        child.setParent(this);

        return Array.prototype.splice.call(this, start, deleteCount, child);
    }

    remove () {
        this.detach();

        for (let i = 0, t = this.length; i < t; ++i) {
            this[i].setParent(null);
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
