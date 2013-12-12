config = require "../lib/config"

exports.configTest =
  "default test": (test) ->
    Config = new config("random.json")

    test.equal Config.config.type.length, 4
    test.equal Config.config.url, undefined

    test.done()

  "load lorax.json": (test) ->
    Config = new config
    test.equal Config.config.url, "https://github.com/adrianlee44/lorax"

    test.done()

  "Get function": (test) ->
    Config = new config
    test.equal Config.get("url"), "https://github.com/adrianlee44/lorax"
    test.done()

  "Set function": (test) ->
    Config = new config

    Config.set "issue", "/issues/test/%s"
    test.equal Config.get("issue"), "/issues/test/%s"

    test.done()

  "Custom property as true": (test) ->
    Config = new config
    test.ok Config.custom

    test.done()

  "Custom property as false": (test) ->
    Config = new config("random.json")
    test.equal Config.custom, false

    test.done()
