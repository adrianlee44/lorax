util = require "../lib/util"

exports.utilTest =
  "Extend test": (test) ->
    orig   = {a: "1", b: "2"}
    newObj = {a: "3", c:"4"}
    result = util.extend {}, orig, newObj

    test.equal result.a, "3"
    test.equal result.b, "2"
    test.equal result.c, "4"

    test.done()
