# Lorax

![Tests](https://github.com/adrianlee44/lorax/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/adrianlee44/lorax/graph/badge.svg?token=REISFTOVEW)](https://codecov.io/gh/adrianlee44/lorax)
[![License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](https://github.com/adrianlee44/lorax/blob/master/LICENSE-MIT)
[![NPM](https://img.shields.io/npm/v/lorax.svg?style=flat-square)](https://www.npmjs.org/package/lorax)

Lorax is a node package to generate changelog by parsing formatted git commits. One of the problems people run into when working with an open-sourced project is having trouble knowing what have been fixed, updated or created. Some people solve this problem by reading through the git log while other might ask on Github issue or Stackoverflow.

Lorax tries to solve this problem by automating the changelog generation process. Lorax will read through all the commits between tags and generate an easy to read markdown changelog.

[View Lorax's changelog as an example](https://github.com/adrianlee44/lorax/blob/master/changelog.md)

## Example

Using Lorax git commit log as an example

```
commit 76adc163ab03e7e6faf553f3e9ef86b4ab1e31b7
Author: Adrian Lee <208855+adrianlee44@users.noreply.github.com>
Date:   Wed Dec 11 02:11:24 2013 -0800

    chore(lorax.json): Switched to use https

commit 997fe15d42e5f59264edc7e8291c97785d5988f0
Author: Adrian Lee <208855+adrianlee44@users.noreply.github.com>
Date:   Wed Dec 11 02:11:07 2013 -0800

    feature(git): Updated getLog function so read all logs when no tag is provided

commit c1cffd76f985bf267bb1983002ab368129a11735
Author: Adrian Lee <208855+adrianlee44@users.noreply.github.com>
Date:   Fri Dec 6 09:26:45 2013 -0800

    feature(all): Initial commit
```

Lorax will generate a changelog

```markdown
# v0.1.0 (2013/12/13)

## Features

- **all:** Initial commit
  ([c1cffd76](https://github.com/adrianlee44/lorax/commit/c1cffd76f985bf267bb1983002ab368129a11735))
- **git:** Updated getLog function so read all logs when no tag is provided
  ([997fe15d](https://github.com/adrianlee44/lorax/commit/997fe15d42e5f59264edc7e8291c97785d5988f0))
```

## Installation

```bash
$ npm install -g lorax
```

## Usage

```bash
Usage: lorax [options]

Generate changelog by parsing formatted git commits

Options:
  -V, --version        display version number
  -t, --tag <tag>      tag of the upcoming release (default: "3.0.0")
  -f, --file <file>    output file name (default: "changelog.md")
  -s, --since [tag]    starting tag version (if not specified, uses all commits since last tag)
  -p, --prepend        prepend changelog to existing file instead of overwriting
  -c, --config <file>  path to configuration file (default: "lorax.json")
  -h, --help           display help for command

Examples:
  $ lorax                                   # Generate changelog for current version to changelog.md
  $ lorax -t v2.0.0                         # Generate changelog for v2.0.0 release
  $ lorax -t v1.5.0 -s v1.4.0 -f HISTORY.md # Generate changelog from v1.4.0 to v1.5.0 in HISTORY.md
  $ lorax -p -t v1.1.0                      # Prepend new changelog to existing file

Configuration:
  Create a lorax.json file in your project root to customize settings.
  See: https://github.com/adrianlee44/lorax#configurations
```

## Git commit format

```
type(component): commit message
detailed message

BREAKING CHANGES
- Nothing really

Fixes #123
```

Example

```
feature(lorax): Hello World

Close #321
```

## Configurations

Project can add `lorax.json` in root directory to override default settings

```js
{
  issue: "/issues/%s",
  commit: "/commit/%s",
  types: {
    fix: {
      title: 'Bug Fixes',
      regex: '^fix',
    },
    feature: {
      title: 'Features',
      regex: '^feat(ure)?',
    },
    breaking: {
      title: 'Breaking Changes',
      regex: 'BREAKING',
    },
    refactor: {
      title: 'Optimizations',
      regex: '^refactor',
    },
    test: {
      title: 'Testing',
      regex: '^test',
    },
    doc: {
      title: 'Documentation',
      regex: '^doc',
    },
  },
  url: "https://github.com/adrianlee44/lorax"
}
```

| key    | description                                                                | Default      |
| ------ | -------------------------------------------------------------------------- | ------------ |
| issue  | Partial URL for issues                                                     | `/issues/%s` |
| commit | Partial URL for commits                                                    | `/commit/%s` |
| types  | Configuration including display title and regex for type of commit message | See above    |
| url    | URL of the repo                                                            | ''           |
