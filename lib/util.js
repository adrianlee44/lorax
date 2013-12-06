var extend, slice,
  __hasProp = {}.hasOwnProperty;

slice = Array.prototype.slice;

extend = function(dest) {
  var key, obj, value, _i, _len, _ref;
  _ref = slice.call(arguments, 1);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    obj = _ref[_i];
    if (obj) {
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        value = obj[key];
        dest[key] = value;
      }
    }
  }
  return dest;
};

module.exports = {
  extend: extend
};
