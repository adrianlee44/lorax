# 3.1.0-2 (2020/7/24)

## Bug Fixes

- **any:**
  - Changes:
    - tweak parser to recognize all fix commits (reverts a recent change of a match regex)
    ([c85df558](https://github.com/adrianlee44/lorax/commit/c85df558))
  - Changes:
    - fix output for commit messages which are formatted as a plain markdown list ("Mother Of All" commits)
    ([2d4e6d38](https://github.com/adrianlee44/lorax/commit/2d4e6d38))
  - Changes:
    - fix git log with a given tag string: error on Windows plaforms, e.g.:
    
          Result: Command failed: git log -E --format=%H%n%B%n==END== HEAD '^v3.0.0' --
          fatal: bad revision ''v3.0.0''
    
    - fix indentation of multiline commits in printer output.
    ([7a1b8f05](https://github.com/adrianlee44/lorax/commit/7a1b8f05))
  - Changes:
    - catch errors in the promise chain and properly report them instead of silently eating them
    - fix git log commandline to work on windows where the ^ in the grep regex is a little too magical: add extra double quotes around the commandline parameter, which won't hurt on any platform
    - tweak the getLastTag code to use another git command; this one would also work where we need to produce *all* tags accessible from current checkout HEAD
    ([e4cbdeea](https://github.com/adrianlee44/lorax/commit/e4cbdeea))
  - Changes:
    - fix npm scripts to run on Windows as well as other (unix) platforms
    ([7272b931](https://github.com/adrianlee44/lorax/commit/7272b931))

## Features

- **any:** Changes:
  - added code to strip off conflict reports of merge commits
  - also strip off sign-off lines, etc.
  ([2d4e6d38](https://github.com/adrianlee44/lorax/commit/2d4e6d38))

  - now `-a` (generate ALL) functionality is implemented completely: lorax cycles through the tags from old to young and builds up the CHANGELOG file as it goes.
  ([ab9d9057](https://github.com/adrianlee44/lorax/commit/ab9d9057))

  - added getAllTags() internal API as a first step towards proper `-a` = generate complete ChangeLog file functionality, which MAY span multiple tags = releases.
  ([7a1b8f05](https://github.com/adrianlee44/lorax/commit/7a1b8f05))

  - add support for arbitrary commits, not just strict conventional-changelog / angular format. (kill the `git log` grep clause, for starters)
  - fix sections[type] --> null object access crash when encountering commits which are pure chore or other 'misc' work
  - cope properly with multiline commit messages: DO NOT nuke those newlines in the commit message
  - cope with arbitrary section types, e.g. 'chore'.
  ([735d9683](https://github.com/adrianlee44/lorax/commit/735d9683))

  - make sure headings are surrounded by empty lines: the more strict markdown renderers require this for headings to be properly recognized.
    ([d4694cdf](https://github.com/adrianlee44/lorax/commit/d4694cdf))


# v3.0.0 (2020/4/27)

## Bug Fixes

- **lorax:**
  - Fix executable script
    ([9721c520](https://github.com/adrianlee44/lorax/commit/9721c520))
  - Allow space before component
    ([7c8d0e39](https://github.com/adrianlee44/lorax/commit/7c8d0e39))

## Features

- **lorax:** Add doc and test to default
  ([f9620729](https://github.com/adrianlee44/lorax/commit/f9620729))

## Optimizations

- **lorax:**
  - Remove unused variable
    ([3087227f](https://github.com/adrianlee44/lorax/commit/3087227f))
  - Convert to TypeScript
    ([e6df0025](https://github.com/adrianlee44/lorax/commit/e6df0025))
  - Switch q to bluebird
    ([1b20fbbf](https://github.com/adrianlee44/lorax/commit/1b20fbbf))
- **util:** Remove custom extend and use Object.assign
  ([f70b2660](https://github.com/adrianlee44/lorax/commit/f70b2660))


# v2.1.0 (2017/5/7)

## Features

- **lorax:** Add prepend option and prepend new changelog to existing file
  ([8bcf88ff](https://github.com/adrianlee44/lorax/commit/8bcf88ff))

## Optimizations

- **lorax:**
  - Clean up how lorax write to file
    ([4c8bef97](https://github.com/adrianlee44/lorax/commit/4c8bef97))
  - Classify lorax
    ([fad27194](https://github.com/adrianlee44/lorax/commit/fad27194))
- **printer:** Add 2 extra lines to the end of the changelog
  ([78d5ef7b](https://github.com/adrianlee44/lorax/commit/78d5ef7b))


# v2.0.0 (2016/11/16)

## Breaking Changes

- **lorax:**  Command went from `lorax [tag] [file]` to `lorax -t [tag] -F [file]` with default values
  ([f19449bf](https://github.com/adrianlee44/lorax/commit/f19449bf))

## Optimizations

- **printer:** Abstract out all the templates
  ([9eabf1f6](https://github.com/adrianlee44/lorax/commit/9eabf1f6))


# v1.1.0 (2016/3/13)

## Bug Fixes

- **lorax:** Fix Config not getting passed to printer
  ([3195601d](https://github.com/adrianlee44/lorax/commit/3195601d))

## Optimizations

- **printer:** Add Printer class
  ([8f0ffa60](https://github.com/adrianlee44/lorax/commit/8f0ffa60))


# v1.0.0 (2015/12/14)

## Bug Fixes

- **lorax:**
  - Fix unable to generate changelog
    ([16a05a5a](https://github.com/adrianlee44/lorax/commit/16a05a5a))
  - Forgot to rename write to render
    ([fec84fdd](https://github.com/adrianlee44/lorax/commit/fec84fdd))
  - Fixed not parsing long commit message correctly
    Line breaks were removed before to form a one line message
    Changes allow for creating markdown lists or code blocks
    ([a15c1769](https://github.com/adrianlee44/lorax/commit/a15c1769))

## Features

- **config:**
  - Find lorax.json up the directory tree
    ([4bbce1df](https://github.com/adrianlee44/lorax/commit/4bbce1df))
  - Add reset to config module
    ([68be8a86](https://github.com/adrianlee44/lorax/commit/68be8a86))
- **lorax:** Add starting tag option
  ([fc182b40](https://github.com/adrianlee44/lorax/commit/fc182b40),
   [#3](https://github.com/adrianlee44/lorax/issues/3))

## Optimizations

- **git:** Updated API when errors occur
  ([8b6c8264](https://github.com/adrianlee44/lorax/commit/8b6c8264))
- **lorax:**
  - Rename function to render and allow timestamp as option
    ([f4469fe0](https://github.com/adrianlee44/lorax/commit/f4469fe0))
  - Clean up getLog function
    ([c9fbbf9c](https://github.com/adrianlee44/lorax/commit/c9fbbf9c))
  - Clean up code and update to es2015
    ([65e71888](https://github.com/adrianlee44/lorax/commit/65e71888))
  - Clean up existing code
    ([2e5ccba5](https://github.com/adrianlee44/lorax/commit/2e5ccba5))
  - Return empty string when no commit is provided
    ([c774cffa](https://github.com/adrianlee44/lorax/commit/c774cffa))
  - Create issue link only if issue number is passed
    ([628d6b25](https://github.com/adrianlee44/lorax/commit/628d6b25))
  - Cleaned up code for getting git log
    ([ed673058](https://github.com/adrianlee44/lorax/commit/ed673058))
  - Converted Coffeescript to Javascript
    ([c9063335](https://github.com/adrianlee44/lorax/commit/c9063335))


# v0.1.3 (2014/1/6)

## Features

- **lorax:** Allow specifying tag when reading log
  ([0dff7d0d](https://github.com/adrianlee44/lorax/commit/0dff7d0d))


# v0.1.2 (2014/1/5)

## Bug Fixes

- **lorax:**
  - Fixed not able to parse multiple issues
    ([0d3a6e5c](https://github.com/adrianlee44/lorax/commit/0d3a6e5c))
  - Fixed not parsing special characters in component name
    ([8911a1cf](https://github.com/adrianlee44/lorax/commit/8911a1cf))

## Features

- **config:** Allow setting with an object
  ([84ae8ae7](https://github.com/adrianlee44/lorax/commit/84ae8ae7))
- **lorax:** Updated API to include git and Config module
  ([72e47af9](https://github.com/adrianlee44/lorax/commit/72e47af9))

## Optimizations

- **lorax:** Refactored lorax to make API easier to use
  ([070c798d](https://github.com/adrianlee44/lorax/commit/070c798d))


# v0.1.1 (2014/1/5)

## Optimizations

- **lorax:** Refactored lorax to make API easier to use
  ([070c798d](https://github.com/adrianlee44/lorax/commit/070c798dc663bee0b0e44cef6893e21daf24fe4a))


# v0.1.0 (2013/12/13)

## Features

- **all:** Initial commit
  ([c1cffd76](https://github.com/adrianlee44/lorax/commit/c1cffd76))
- **config:** Allow custom path
  ([86c84897](https://github.com/adrianlee44/lorax/commit/86c84897))
- **git:** Updated getLog function so read all logs when no tag is provided
  ([997fe15d](https://github.com/adrianlee44/lorax/commit/997fe15d))
- **lorax:**
  - Fully support gfm for closing issues
    ([d5b66a21](https://github.com/adrianlee44/lorax/commit/d5b66a21))
  - Added creating markdown format changelog and shortcut generate function
    ([db035b70](https://github.com/adrianlee44/lorax/commit/db035b70))

