
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

    say(text, attributes = {}) {
        let params = _.cloneDeep(attributes);
        params.text = text;

        let _self = this;
        let validationError;

        let _validateParams = function () {

            const constraints = {
                text: function (value) {
                    if (value && !validate.isString(value)) {
                        return {
                            format: 'text must be a string'
                        }
                    }
                    return {
                        presence: true
                    }
                },
                voice: function (value) {
                    let choices = ['man', 'woman'];
                    if (value && !choices.includes(value)) {
                        return {
                            format: 'invalid option'
                        }
                    }
                    return null;
                },
                playBeep: function (value) {
                    if (!validate.isBoolean(value)) {
                        return {
                            format: 'invalid option'
                        }
                    }
                    return null;
                }
            };

            let error = validate(params, constraints);
            if (error) {
                let msg = '';
                for (let k in error) {
                    msg += error[k] + "; ";
                }

                validationError = new Error(msg);
            }
        }

        _validateParams();

        if (validationError) {
            throw validationError;
        }

        const action = {
            tag: 'Say',
            text,
            attributes
        }

        this.buildAction(action);
        return this;
    }

    play(url) {
        let attributes = { url };
        let _self = this;
        let validationError;

        let _validateParams = function () {

            const constraints = {
                url: {
                    presence: true,
                    url: true
                }
            };

            let error = validate(attributes, constraints);
            if (error) {
                let msg = '';
                for (let k in error) {
                    msg += error[k] + "; ";
                }

                validationError = new Error(msg);
            }
        }

        _validateParams();

        if (validationError) {
            throw validationError;
        }

        const action = {
            tag: 'Play',
            attributes
        }

        this.buildAction(action);
        return this;
    }
}

module.exports = ActionBuilder;
