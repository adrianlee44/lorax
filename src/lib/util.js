// @flow

/**
 * @name util
 * @description
 * Basic utility functions
 */

'use strict';

function extend(dest: Object): Object{
  const args = Array.prototype.slice.call(arguments, 1);

  for (let i = 0; i < args.length ; i++) {
    const obj = args[i];
    if (obj) {
      for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        dest[key] = obj[key];
      }
    }
  }

  return dest;
}

module.exports = {extend};
