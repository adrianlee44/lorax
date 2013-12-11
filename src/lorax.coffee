###
@name Lorax

@description
A node module which reads the git log and create a human readable changelog

@author Adrian Lee
@url https://github.com/adrianlee44/lorax
@license MIT

@dependencies
- commander
###

util   = require "util"
fs     = require "fs"
config = require "./lib/config"
git    = require "./lib/git"

Config     = new config()
url        = Config.get "url"
issueTmpl  = Config.get "issue"
commitTmpl = Config.get "commit"

###
@function
@name linkToIssue
@description
Create a markdown link to issue page with issue number as text
@param {String} issue Issue number
@returns {String} markdown text
###
linkToIssue  = (issue) ->
  if url and issueTmpl
    issueLink = "[#%s](#{url}#{issueTmpl})"
    util.format issueLink, issue, issue
  else
    "##{issue}"

###
@function
@name linkToCommit
@description
Create a markdown link to commit page with commit hash as text
@param {String} hash Commit hash
@returns {String} markdown text
###
linkToCommit = (hash) ->
  if url and commitTmpl
    commitLink = "[%s](#{url}#{commitTmpl})"
    util.format commitLink, hash.substr(0, 8), hash
  else
    hash.substr(0, 8)

###
@function
@name parseCommit
@description
Given a string of commits in a special format, parse string and creates an array of
commit objects with information
@param {String} commit Commit string
@returns {Array} Array of commit objects
###
parseCommit = (commit) ->
  return unless commit? and commit

  lines     = commit.split "\n"
  commitObj =
    type:      ""
    component: ""
    message:   ""
    hash:      lines.shift()
    issues:    []
    title:     lines.shift()

  for line, i in lines when match = line.match /(?:Closes|Fixes)\s#(\d+)/
    commitObj.issues.push parseInt(match[1])
    lines.splice i, 1

  message = lines.join " "
  if match = commitObj.title.match /^([^\(]+)\(([\w\.]+)\):\s+(.+)/
    commitObj.type      = match[1]
    commitObj.component = match[2]
    commitObj.message   = match[3]
    commitObj.message  += "\n" + message if message

  if match = message.match /BREAKING CHANGE[S]?:?([\s\S]*)/
    commitObj.type    = "breaking"
    commitObj.message = match[1]

  return commitObj

###
@function
@name write
@description
Using preprocessed array of commits, generate a changelog in markdown format with version
and today's date as the header
@param {Array} commits Preprocessed array of commits
@param {String} version Current version
@returns {String} Markdown format changelog
###
write = (commits, version) ->
  output        = ""
  sections      = {}
  display       = Config.get "display"
  sections[key] = {} for key, name of display

  for commit in commits
    section = sections[commit.type]
    section[commit.component] ?= []
    section[commit.component].push commit

  today   = new Date()
  output += "# #{version} (#{today.getFullYear()}/#{today.getMonth() + 1}/#{today.getDate()})\n"

  for sectionType, list of sections
    components = Object.getOwnPropertyNames(list).sort()

    continue unless components.length

    output += "## #{display[sectionType]}\n"

    for componentName in components
      prefix   = "-"

      if list[componentName].length > 1
        output += util.format "- **%s:**\n", componentName
        prefix  = "  -"
      else
        prefix = util.format "- **%s:**", componentName

      for item in list[componentName]
        output += util.format "%s %s\n  (%s", prefix, item.message, linkToCommit(item.hash)
        if item.issues.length
          output += ",\n   #{item.issues.map(linkToIssue).join(", ")}"
        output += ")\n"

    output += "\n"

  output += "\n"

  return output

###
@function
@name generate
@description
A shortcut function to get the latest tag, parse all the commits and generate the changelog
@param {String} toTag The latest tag
@param {String} file Filename to write to
@param {String} fromTag A specific tag to start from
###
generate = (toTag, file, fromTag) ->
  parseAndWrite = (commits) ->
    parsedCommits = (parseCommit commit for commit in commits when commit)

    console.log "Parsed #{parsedCommits.length} commit(s)"

    result = write parsedCommits, toTag
    fs.writeFileSync file, result, encoding: "utf-8"

    console.log "Generated changelog to #{file} (#{toTag})"

  parseFromLastTag = (lastTag) ->
    tag = fromTag or lastTag
    if tag
      console.log "Reading commits since #{tag}"
    else
      console.log "Reading all commits"

    grep = Config.get("type").join "|"
    git.getLog(grep, tag).then parseAndWrite

  git.getLastTag().then parseFromLastTag, -> parseFromLastTag()

lorax = module.exports = {
  parseCommit
  write
  generate
}