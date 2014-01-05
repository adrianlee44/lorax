lorax = require "../index"
commit = """
          7e7ac8957953e1686113f8086dc5b67246e5d3fa
          feature(lorax): Basic testing

          Fixes #123
          """

exports.parseCommitTest =
  "hash parse": (test) ->
    obj = lorax.parseCommit commit
    test.equal obj.hash, "7e7ac8957953e1686113f8086dc5b67246e5d3fa"
    test.done()

  "type parse": (test) ->
    obj = lorax.parseCommit commit
    test.equal obj.type, "feature"
    test.done()

  "component parse": (test) ->
    obj = lorax.parseCommit commit
    test.equal obj.component, "lorax"
    test.done()

  "component special character parse": (test) ->
    specialCommit = """
    7e7ac8957953e1686113f8086dc5b67246e5d3fa
    feature(lorax-test!): Basic testing
    """
    obj = lorax.parseCommit specialCommit
    test.equal obj.component, "lorax-test!"
    test.done()

  "message parse": (test) ->
    obj = lorax.parseCommit commit
    test.equal obj.message, "Basic testing"
    test.done()

  "title parse": (test) ->
    obj = lorax.parseCommit commit
    test.equal obj.title, "feature(lorax): Basic testing"
    test.done()

  "issue parse": (test) ->
    obj = lorax.parseCommit commit
    test.equal obj.issues[0], "123"
    test.done()

  "issues parse": (test) ->
    issuesCommit = """
    7e7ac8957953e1686113f8086dc5b67246e5d3fa
    feature(lorax): Basic testing

    Fixes #123
    Fixes #124
    """

    test.expect 2
    obj = lorax.parseCommit issuesCommit
    test.equal obj.issues[0], 123
    test.equal obj.issues[1], 124
    test.done()

  "breaking change parse": (test) ->
    breakingCommit = """
    7e7ac8957953e1686113f8086dc5b67246e5d3fa
    feature(lorax): Basic testing

    BREAKING CHANGE: Testing
    """
    test.expect 2
    obj = lorax.parseCommit breakingCommit
    test.equal obj.type, "breaking"
    test.equal obj.message, " Testing"

    test.done()
