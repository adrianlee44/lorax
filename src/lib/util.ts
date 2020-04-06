'use strict'

/**
 * @name util
 * @description
 * Basic utility functions
 */

export function extend<T>(dest: T, ...args: Array<T>): T {
  for (let i = 0; i < args.length; i++) {
    const obj = args[i]
    if (obj) {
      for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
        dest[key] = obj[key]
      }
    }
  }

  return dest
}
