slice = Array::slice

extend = (dest) ->
  for obj in slice.call(arguments, 1) when obj
    dest[key] = value for own key, value of obj
  return dest

module.exports = {
  extend
}