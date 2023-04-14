/**
 * Copyright (c) 2023 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */


function is_object(value) {
    if(!value) return false;
    return value.toString() === '[object Object]';
}

function ensure_err(val, name, type) {
    throw new Error(
        `${name} parameter must be an ${type}, ${typeof val} entered.`
    );
}
const validateType = {
    object: (val, name = 'parameter') => {
        if (!is_object(val)) ensure_err(val, name, 'object');
    },
    string: (val, name = 'parameter') => {
        if (typeof val !== 'string') ensure_err(val, name, 'string');
    },
};

module.exports = { is_object, validateType };
