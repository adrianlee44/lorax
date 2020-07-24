# Lorax

[![Build Status](https://img.shields.io/travis/GerHobbelt/lorax/master.svg?style=flat-square)](https://travis-ci.org/GerHobbelt/lorax)
[![Coverage Status](https://img.shields.io/coveralls/GerHobbelt/lorax/master.svg?style=flat-square)](https://coveralls.io/github/GerHobbelt/lorax?branch=master)
[![License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](https://github.com/GerHobbelt/lorax/blob/master/LICENSE-MIT)
[![NPM](https://img.shields.io/npm/v/lorax.svg?style=flat-square)](https://www.npmjs.org/package/@gerhobbelt/lorax)

**NOTE**: this is a fork/derivative of [the original lorax tool available here](https://github.com/adrianlee44/lorax/).

## What does `lorax` do?

Lorax is a node package to generate a changelog by parsing formatted git commits from the local repository. One of the problems people run into when working with an open-sourced project is having trouble knowing what have been fixed, updated or created. Some people solve this problem by reading through the git log while others might ask on Github issue or Stackoverflow.

Lorax tries to solve this problem by automating the changelog generation process. Lorax will read through all the commits between tags and generate an easy to read markdown changelog.

[View Lorax's changelog as an example](https://github.com/GerHobbelt/lorax/blob/master/changelog.md)


## Key differences with other packages

- Many other tools do not use the local git repository but require github or gitlab access, thus not allowing for off-line work (plus being dependent on the stability of the relevant website's API and information desity of data produced by said API).
- **Infers** metadata where necessary. (While the original `lorax` was very strict, this derivative tool approaches the problem from the *other* direction: every commit has value and should be categorized. It's up to the user and their lorax configuration to decide which of those parts should make it into the CHANGELOG)
- Auto-detects github issue references in any commit and links CHANGELOG entries to issues for fast drill-down.
- All CHANGELOG entries are linked to their github diff view pages for easy access to the actual code changes. Every entry has a corresponding set of code changes which you can see immediately if you want to.
- It *helps* to use a commit convention like angular's, but you DO NOT loose anything when you stumble or otherwise happen to have non-conforming git commits & messages.


## Example usage

Using Lorax git commit log as an example

```
commit 76adc163ab03e7e6faf553f3e9ef86b4ab1e31b7
Author: Adrian Lee <GerHobbelt@gmail.com>
Date:   Wed Dec 11 02:11:24 2013 -0800

    chore(lorax.json): Switched to use https

commit 997fe15d42e5f59264edc7e8291c97785d5988f0
Author: Adrian Lee <GerHobbelt@gmail.com>
Date:   Wed Dec 11 02:11:07 2013 -0800

    feature(git): Updated getLog function so read all logs when no tag is provided

commit c1cffd76f985bf267bb1983002ab368129a11735
Author: Adrian Lee <GerHobbelt@gmail.com>
Date:   Fri Dec 6 09:26:45 2013 -0800

    feature(all): Initial commit
```

Lorax will generate a changelog

```markdown
# v0.1.0 (2013/12/13)
## Features
- **all:** Initial commit
  ([c1cffd76](https://github.com/GerHobbelt/lorax/commit/c1cffd76f985bf267bb1983002ab368129a11735))
- **git:** Updated getLog function so read all logs when no tag is provided
  ([997fe15d](https://github.com/GerHobbelt/lorax/commit/997fe15d42e5f59264edc7e8291c97785d5988f0))
```

## Installation

```bash
$ npm install -g @gerhobbelt/lorax
```

## Usage

```bash
Usage: lorax -t [tag] [options]

  Options:
    -V, --version      output the version number
    -F, --file [FILE]  Name of the file to write to [CHANGELOG.md] (default: "CHANGELOG.md")
    -p, --prepend      Prepend to the file
    -a, --all          Generate a complete ChangeLog, i.e. ALL git commits for ALL tags
    -s, --since [tag]  Starting tag version
    -t, --tag [tag]    Tag of the upcoming release [2.1.0] (default: <obtained from your package.json>)
    -h, --help         display help for command
```

To generate the changelog

```bash
$ lorax -t v0.1.0 -F CHANGELOG.md
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

Closed #321
```

### Git commit (meta)data extraction process

> See also `src/lib/parser.ts` source code.
 
Every git commit message ...

1. is cleaned up by stripping off any trailing surplus such as \# hash-prefixed merge conflict file collision reports and author ssign-off lines
   
   > `COMMIT_MESSAGE_SURPLUS_TAIL = /^\s*(?:(?:# Conflicts:)|(?:Signed-off-by:)|(?:Co-authored-by:))/`
   > 
   > The line matching this regex and any lines below that one are discarded.

2. is inspected to find any github issue references which are mentioned as done / worked on. These issues will be linked to in the corresponding, generated CHANGELOG item.

   > `GITHUB_ISSUE_WORK_DONE_REGEX = /(?:close(?:s|d)?|fix(?:es|ed)?|resolve(?:s|d)?implement(?:s|ed)?)\s+#(\d+)/i`
   > 
   >  `match[1]` in that regex is the extracted github issue number

3. is matched against a generic angular / conventional-changelog format rule.

   > `ANGULAR_COMMIT_MESSAGE_EXTRACTOR_REGEX = /^(\w+)\s*(?:\(([^\r\n\s()](?:[^\r\n()]*[^\r\n\s()])?)\))?:\s+(.+)/`
   > 
   > - `match[1]`: commit type identifier
   > - `match[2]`: *optional* category
   > - `match[3]`: commit message
 
   When the commit message MATCHES this format, it is processed using the extracted (meta)data listed above.
   The process then proceeds to the next step listed below: step 4.

   When the commit message DOES NOT MATCH this format, a series of heuristic rule checks are applied to infer the *message type*.
   The commit message is then filed under the infered *message type*. 
   
   When no type could be infered, the message will be filed under the `misc` a.k.a. 'miscellaneous' *type*.

   The default heuristic rules' regexes are listed below in the [Configuration](#Configuration) section as the `.parse` object/map. 

   Heuristic rule regexes are executed in order of appearance and the first match decides the *message type* for the given commit message.

   > **Warning**: this implies that you will have some cleanup / redistribution work remaining when you have "Mother Of All" commit messages in your repository, where one commit lists several fixes, changes and/or other activities combined.
   > 
   > We COULD duplicate the message to every infered *category*, but **we have decided against that tool behaviour** as it would NOT make matters more obvious or result in less editing work of the generated CHANGELOG: we would be deleting many lines *many* times  vs. cut & paste of fewer lines to different *type* sections.

4. is matched against a generic "*breaking change*" heuristic regex.

   When the rule regex matches the commit message, any extracted or infered *message type* is **overridden** and the `breaking` message type is assigned instead.


#### TL;DR?

1. strip off trailing low-value message content verbosity.
2. find probably final github issue references for linking.
3. extract type and category metadata. Infer these if necessary.
4. `BREAKING CHANGE(S)` override everything else as a *message type*.


## Configuration

Project can add `lorax.json` in root directory to override default settings. Lorax will automatically look for 
and load `lorax.json` in the current working directory.

```js
{
  issue: "/issues/%s",
  commit: "/commit/%s",
  parse: {
    breaking: "/\\bBREAKING\\b/",
    feature: [
      "/\\bfeature\\w*/i",
      "/\\badd(?:ed|ing)?\\s+support\\b/i",
      "/\\baugmented\\b/i",
      "/\\b(?:is|was|(?:has been)) implemented\\b/i"
    ],
    fix: "/\\bfix\\w*/i",
    refactor: [
      "/\\brefactor\\w*/i",
      "/\\bredesign\\w*/i"
    ],
    doc: [
      "/\\bdoc\\w*/i",
      "/\\bREADME/"
    ],
    test: "/\\btest\\w*/i",
    chore: [
      "/bump build (?:revision|version)/i",
      "/updated npm packages/i",
      "/regenerate .*files/i",
      "/lint fixes/i",
      "/Merge .* branch/i",
      "/Merge tag/i",
      "/(?:es)?lint/i"
    ],
    misc: null
  },
  display: {
    breaking: "Breaking Changes",
    feature: "Features",
    fix: "Bug Fixes",
    refactor: "Optimizations",
    test: "Testing",
    doc: "Documentation",
    misc: "Miscellaneous"
  },
  url: "https://github.com/GerHobbelt/lorax"
}
```

key | description | Default
--- | --- | ---
issue | Partial URL for issues | `issues/%s`
commit | Partial URL for commits | `/commit/%s`
parse | A map of types of commit messages to parse and the regexes which match if the commit is not formatted in the conventional-changelog / angular format.

  The key of each item in this object identifies the commit message **type**, which will be checked against the `display` list for outputting into CHANGELOG.md later.

  The *value* of the item is either a single *regex string* or an array of *regex strings*, where a *regex string* is the string representation of a literal JavaScript regex, e.g. `"/match_me_\\w+/i"` -- note that regex escape character `\\` must be duplicated so `\w` must be written as `\\w`.

  **NOTE**: the *order* in which the keys and regexes are listed is important as **the first match will determine the commit message type**. | See code block above
display | Display name for each commit message type. | See next section
url | URL of the Github repo | ''



### Display name default

key | display name
--- | ---
breaking | Breaking Changes
feature | Features
fix | Bug Fixes
refactor | Optimizations
test | Testing
doc | Documentation
misc | Miscellaneous

**NOTE**: the *order* in which the keys are listed is important as the types are printed in this order.

If the git log commits adhere to the angular / conventional-changelog format (`type(category): message`), then any detected type will be added at the end of this list.

If you DO NOT want a specific type to be printed in the generated output, you can set the display name to `false` in the `lorax.json` configuration file.
