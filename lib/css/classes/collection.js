"use strict";

/**
 * Class to filter and traverse into the css tree
 */
class Collection extends Array {

    getChildren (match) {
        const result = new Collection();

        for (let i = 0, t = this.length; i < t; ++i) {
            if (this[i].is(match)) {
                result.push(this[i]);
            }
        };

        return result;
    }

    getChild (match) {
        for (let i = 0, t = this.length; i < t; ++i) {
            if (this[i].is(match)) {
                return this[i];
            }
        }
    }

    hasChild (match) {
        for (let i = 0, t = this.length; i < t; i++) {
            if (this[i].is(match)) {
                return true;
            }
        }

        return false;
    }

    get (match) {
        for (let i = 0, t = this.length; i < t; i++) {
            if (this[i].is(match)) {
                return this[i];
            }

            if (this[i] instanceof Collection) {
                let found = this[i].get(match);

                if (found) {
                    return found;
                }
            }
        }
    }

    getAll (match, result) {
        result = result || new Collection();

        for (let i = 0, t = this.length; i < t; i++) {
            if (this[i].is(match)) {
                result.push(this[i]);
            }
            
            if (this[i] instanceof Collection) {
                this[i].getAll(match, result);
            }
        }

        return result;
    }

    has (match) {
        for (let i = 0, t = this.length; i < t; i++) {
            if (this[i].is(match) || (this[i] instanceof Collection && this[i].has(match))) {
                return true;
            }
        }

        return false;
    }

    toArray () {
        return this.map(child => child.toString());
    }
}

module.exports = Collection;