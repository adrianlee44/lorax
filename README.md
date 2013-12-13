Lorax
===
Lorax is a simple node package to generate changelog by parsing formatted git commits

## Example
Using Lorax git commit log as an example

```
commit 76adc163ab03e7e6faf553f3e9ef86b4ab1e31b7
Author: Adrian Lee <adrianlee44@gmail.com>
Date:   Wed Dec 11 02:11:24 2013 -0800

    chore(lorax.json): Switched to use https

commit 997fe15d42e5f59264edc7e8291c97785d5988f0
Author: Adrian Lee <adrianlee44@gmail.com>
Date:   Wed Dec 11 02:11:07 2013 -0800

    feature(git): Updated getLog function so read all logs when no tag is provided

commit c1cffd76f985bf267bb1983002ab368129a11735
Author: Adrian Lee <adrianlee44@gmail.com>
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
```
$ npm install -g lorax
```

## Usage

```
Usage: lorax [options] [TAG] [FILE]

Options:

  -h, --help     output usage information
  -V, --version  output the version number
```

To generate the changelog
```
$ lorax v0.1.0 changelog.md
```

## Configurations
```js
{
  issue: "/issues/%s",
  commit: "/commit/%s",
  type: ["^fix", "^feature", "^refactor", "BREAKING"],
  display: {
    fix: "Bug Fixes",
    feature: "Features",
    breaking: "Breaking Changes",
    refactor: "Optimizations"
  }
  url: "https://github.com/adrianlee44/lorax"
}
```
### Issue
Partial URL for issues

### Commit
Partial URL for commits

### Type
Type of commit message to parse. Items in this array are joined into a string and used for searching commit messages

**Default** - ^fix|^feature|^refactor|BREAKING

### Display
Display name for each commit message type

### Url
URL of the Github repo

## License

MIT License