// @flow

/**
 * @name util
 * @description
 * Basic utility functions
 */

'use strict';

export function extend(dest: Object, ...args: Array<Object>): Object{
  for (let i = 0; i < args.length ; i++) {
    const obj = args[i];
    if (obj) {
      for (let key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
        dest[key] = obj[key];
      }
    }
  }

  return dest;
}