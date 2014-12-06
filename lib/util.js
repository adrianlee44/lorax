var extend, slice;

slice = Array.prototype.slice;

extend = function(dest) {
  var key, obj, value, i, args;
  args = slice.call(arguments, 1);

  for (i = 0; i < args.length ; i++) {
    obj = args[i];
    if (obj) {
      for (key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        dest[key] = obj[key];
      }
    }
  }

  return dest;
};

module.exports = {
  extend: extend
};
