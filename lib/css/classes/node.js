import { parse } from "../../utils.js";
import Collection from "./collection.js";

const _parent = Symbol("Parent");

/**
 * Class with common methods for nodes
 */
export default class Node {
  constructor(data, type) {
    this.type = type;
    this.data = data || {};
  }

  clone(data) {
    if (data === true) {
      data = {};

      for (let key in this.data) {
        data[key] = this.data[key];
      }

      return new this.constructor(data, this.type);
    }

    return new this.constructor(this.data, this.type);
  }

  cloneBefore() {
    const clone = this.clone();
    this.before(clone);
    return clone;
  }

  cloneAfter() {
    const clone = this.clone();
    this.after(clone);
    return clone;
  }

  is(match) {
    if (!match) {
      return true;
    }

    if (typeof match === "string") {
      return equals(this.type, match);
    }

    if (match instanceof Function) {
      return match.call(this);
    }

    for (let k in match) {
      if (k === "string") {
        if (!equals(this.toString(), match.string)) {
          return false;
        }
      } else if ((this[k] !== undefined) && !equals(this[k], match[k])) {
        return false;
      }
    }

    return true;
  }

  isEmpty() {
    return false;
  }

  getParent(match) {
    if (this[_parent] && (!match || this[_parent].is(match))) {
      return this[_parent];
    }
  }

  hasParent(match) {
    if (!this[_parent]) {
      return false;
    }

    if (!match) {
      return true;
    }

    return this[_parent].is(match);
  }

  getAncestor(match) {
    if (this[_parent]) {
      if (!match || this[_parent].is(match)) {
        return this[_parent];
      }

      return this[_parent].getAncestor(match);
    }
  }

  getAncestors(match, result) {
    result = result || new Collection();

    if (this[_parent]) {
      if (!match || this[_parent].is(match)) {
        result.push(this[_parent]);
      }

      this[_parent].getAncestors(match, result);
    }

    return result;
  }

  hasAncestor(match) {
    if (!this[_parent]) {
      return false;
    }

    if (!match) {
      return true;
    }

    return this[_parent].is(match) ? true : this[_parent].hasParent(match);
  }

  setParent(parent) {
    this[_parent] = parent;
  }

  getSiblings(match) {
    const parent = this[_parent];
    const result = new Collection();

    if (!parent) {
      return result;
    }

    for (let i = 0, t = parent.length; i < t; ++i) {
      if (parent[i] !== this && parent[i].is(match)) {
        result.push(this[i]);
      }
    }

    return result;
  }

  hasSibling(match) {
    const parent = this[_parent];

    if (!parent) {
      return false;
    }

    for (let i = 0, t = parent.length; i < t; ++i) {
      if (parent[i] !== this && parent[i].is(match)) {
        return true;
      }
    }

    return false;
  }

  getSibling(match) {
    const parent = this[_parent];

    if (parent) {
      for (let i = 0, t = parent.length; i < t; ++i) {
        if (parent[i] !== this && parent[i].is(match)) {
          return parent[i];
        }
      }
    }
  }

  getData(key) {
    if (key in this.data) {
      return this.data[key];
    }

    if (this[_parent]) {
      return this[_parent].getData(key);
    }
  }

  getAllData(key, result) {
    result = result || [];

    if (key in this.data) {
      result.push(this.data[key]);
    }

    if (this[_parent]) {
      this[_parent].getAllData(key, result);
    }

    return result;
  }

  setData(key, value) {
    this.data[key] = value;

    return this;
  }

  index() {
    if (this[_parent]) {
      return this[_parent].indexOf(this);
    }

    return -1;
  }

  next() {
    const index = this.index();

    if (index !== -1) {
      return this[_parent][index + 1];
    }
  }

  prev() {
    const index = this.index();

    if (index > 0) {
      return this[_parent][index - 1];
    }
  }

  before(child) {
    const index = this.index();

    if (index !== -1) {
      return this[_parent].splice(index, 0, child);
    }
  }

  codeBefore(code, className) {
    this.before(parse(code, className, this));
  }

  after(child) {
    const index = this.index();

    if (index !== -1) {
      if (index === this[_parent].length) {
        return this[_parent].push(child);
      }

      return this[_parent].splice(index + 1, 0, child);
    }
  }

  codeAfter(code, className) {
    this.after(parse(code, className, this));
  }

  replaceWith(child) {
    const index = this.index();

    if (index !== -1) {
      const parent = this[_parent];
      this.remove();

      return parent.splice(index, 0, child);
    }
  }

  replaceWithCode(code, className) {
    this.replaceWith(parse(code, className, this));
  }

  remove() {
    return this.detach();
  }

  detach() {
    if (this[_parent]) {
      const index = this.index();

      if (index !== -1) {
        this[_parent].splice(index, 1);
        this[_parent] = null;
      }
    }

    return this;
  }

  toAst() {
    const object = {
      type: this.type,
    };

    if ("name" in this) {
      object.name = (this.name === undefined) ? null : this.name;
    }

    if ("vendor" in this) {
      object.vendor = (this.vendor === undefined) ? null : this.vendor;
    }

    if (this instanceof Array) {
      object.children = [];

      this.forEach((child) => object.children.push(child.toAst()));
    }

    return object;
  }

  getContextVendor() {
    if (("vendor" in this) && this.vendor) {
      return this.vendor;
    }

    if (this instanceof Collection) {
      let vendor;

      for (let i = 0, t = this.length; i < t; i++) {
        if (this[i].type !== "Block" && this[i].type !== "Comment") {
          vendor = this[i].getContextVendor();

          if (vendor) {
            return vendor;
          }
        }
      }
    }
  }

  normalizeVendors(vendor) {
    if (vendor === undefined) {
      vendor = this.getContextVendor() || null;
    }

    let k = 0;

    while (this[k]) {
      const child = this[k];

      if (child.type === "Block") {
        child.normalizeVendors(vendor);
      } else if (child.type !== "Comment") {
        let contextVendor = child.getContextVendor();

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

  toCode(code) {
    code.append(this.toString(), this);
  }
}

function equals(value, needle) {
  if (needle === true) {
    return value ? true : false;
  }

  if (needle === false) {
    return value ? false : true;
  }

  if (typeof needle === "string") {
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
