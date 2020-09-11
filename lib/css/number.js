import NodeName from "./classes/node-name.js";

const NUMBER = Symbol.for('NUMBER');

export default class Number extends NodeName {

    static create (reader, parent) {
        if (reader.currToken === NUMBER) {
            return (new Number(reader.data())).setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'Number');
    }

    toString () {
        return '' + this.name;
    }

    toCode (code) {
        let num = this.toString();

        if (!code.get('number-leading-zero')) {
            if (num.indexOf('0.') === 0) {
                num = num.substr(1);
            } else if (num.indexOf('-0.') === 0) {
                num = '-' + num.substr(2);
            }
        }

        code.append(num, this);
    }
}
