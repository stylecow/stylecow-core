import NodeName from "./node-name.js";

/**
 * Class with common methods for nodes that have vendor prefix
 */
export default class NodeVendor extends NodeName {
  setNameWithVendor(name) {
    if (name[0] === "-") {
      const match = name.match(/^(-(\w+)-)?(.+)$/);
      this.vendor = match[2] || null;
      this.name = match[3];
    } else {
      this.vendor = null;
      this.name = name;
    }

    return this;
  }

  getNameWithVendor(name) {
    if (this.vendor) {
      return "-" + this.vendor + "-" + this.name;
    }

    return this.name;
  }

  setVendor(vendor) {
    this.vendor = vendor;

    return this;
  }

  clone(data) {
    const clone = super.clone(data);

    clone.vendor = this.vendor;

    return clone;
  }

  toString() {
    return this.getNameWithVendor();
  }
}
