
const validate = require('validate.js');
const _ = require('lodash');

class ActionBuilder {
    constructor () {
        this.finalized = false;
        this.xml = '<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response>';

        this.buildAction = function (action) {

            const {
                tag,
                text,
                children,
                attributes
            } = action;

            let str = '<' + tag;

            if (attributes && Object.keys(attributes).length > 0) {
                Object.entries(attributes)
                    .forEach(([key, value]) => {
                        str = str.concat(` ${key}="${value}"`);
                    });
            }

            if (children && children.length > 0) {
                str.concat('>');
                children.forEach(child => {
                    str = str.concat(this.buildAction(child));
                });
                str = str.concat(`</${tag}>`);
            } else {
                if (text) {
                    str = str.concat(`>${text}</${tag}>`);
                } else {
                    str = str.concat('/>');
                }
            }

            this.xml = this.xml.concat(str);
        }
    }

    build () {
        if (this.finalized) throw new Error('This builder has been finalized by a call to build()');

        this.finalized = true;
        this.xml = this.xml.concat('</Response>');
        return this.xml;
    }
}

module.exports = ActionBuilder;
