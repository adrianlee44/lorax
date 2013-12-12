fs   = require "fs"
util = require "./util"

class Config
  default:
    issue:  "/issues/%s"
    commit: "/commit/%s"
    type:   ["^fix", "^feature", "^refactor", "BREAKING"]
    display:
      fix:      "Bug Fixes"
      feature:  "Features"
      breaking: "Breaking Changes"
      refactor: "Optimizations"

  constructor: (@path = "lorax.json") ->
    if @custom = fs.existsSync @path
      rawData  = fs.readFileSync @path, encoding: "utf-8"
      try
        jsonData = JSON.parse rawData
      catch e
        return console.log "Invalid #{path}"
      @config  = util.extend {}, @default, jsonData
    else
      @config = util.extend {}, @default

  get: (key) -> @config[key]

  set: (key, value) -> @config[key] = value

  write: (force = false) ->
    if @custom or force
      rawData = JSON.stringify @config, null, "  "
      fs.writeFileSync "lorax.json", rawData, encoding: "utf-8"

module.exports = Config