"use strict";

/**
 * Class with common methods for nodes that have vendor prefix
 */
class NodeVendor extends require('./node-name') {

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
        var clone = new this.constructor(data || this.data);

        clone.name = this.name;
        clone.vendor = this.vendor;

        return clone;
    }

    toString () {
        return this.getNameWithVendor();
    }
}

module.exports = NodeVendor;
