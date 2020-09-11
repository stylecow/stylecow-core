import { parse } from "../../index.js";
import Collection from "./collection.js";
import Node from "./node.js";

/**
 * Class with common methods for nodes that behaves like collections
 */
export default class NodeCollection extends mix(Collection, Node) {
  constructor(data, type) {
    super();

    this.type = type;
    this.data = data || {};
  }

  clone(data) {
    const clone = super.clone(data);

    for (let i = 0, t = this.length; i < t; ++i) {
      clone.push(this[i].clone(data));
    }

    return clone;
  }

  empty() {
    this.splice(0);

    return this;
  }

  isEmpty() {
    for (let i = 0, t = this.length; i < t; i++) {
      if (!this[i].isEmpty()) {
        return false;
      }
    }

    return true;
  }

  push(child) {
    if (child.hasParent()) {
      child.detach();
    }

    child.setParent(this);

    return Array.prototype.push.call(this, child);
  }

  pushCode(code, className) {
    this.push(parse(code, className, this));
  }

  unshift(child) {
    if (child.hasParent()) {
      child.detach();
    }

    child.setParent(this);

    return Array.prototype.unshift.call(this, child);
  }

  unshiftCode(code, className) {
    this.unshift(parse(code, className, this));
  }

  splice(start, deleteCount, child) {
    if (!child) {
      return Array.prototype.splice.call(this, start, deleteCount);
    }

    if (child.hasParent()) {
      child.detach();
    }

    child.setParent(this);

    return Array.prototype.splice.call(this, start, deleteCount, child);
  }

  remove() {
    this.detach();

    for (let i = 0, t = this.length; i < t; ++i) {
      this[i].setParent(null);
      this[i].remove();
    }

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
}
