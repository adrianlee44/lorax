# v1.0.0 (2015/12/13)
## Bug Fixes
- **lorax:**
  - Fix unable to generate changelog
  ([16a05a5a](https://github.com/adrianlee44/lorax/commit/16a05a5a5b00a115cfe427ffe20ace2a1351fddc))
  - Forgot to rename write to render
  ([fec84fdd](https://github.com/adrianlee44/lorax/commit/fec84fddcf308ce9bdd5bbd2d58f91ddbf09563d))
  - Fixed not parsing long commit message correctly Line breaks were removed before to form a one line message Changes allow for creating markdown lists or code blocks
  ([a15c1769](https://github.com/adrianlee44/lorax/commit/a15c1769c5bc0a96277bf08175d0de817282cf3f))

## Features
- **config:**
  - Find lorax.json up the directory tree
  ([4bbce1df](https://github.com/adrianlee44/lorax/commit/4bbce1df5e2b3713766487783c6001037432e572))
  - Add reset to config module
  ([68be8a86](https://github.com/adrianlee44/lorax/commit/68be8a86c191b61f2a3bfe63210409502ceea8f5))
- **lorax:** Add starting tag option
  ([fc182b40](https://github.com/adrianlee44/lorax/commit/fc182b404db196e6ed87788acf465652294504d0),
   [#3](https://github.com/adrianlee44/lorax/issues/3))

## Optimizations
- **git:** Updated API when errors occur
  ([8b6c8264](https://github.com/adrianlee44/lorax/commit/8b6c8264573a497b0eea5e79a1cc55891278a3cd))
- **lorax:**
  - Rename function to render and allow timestamp as option
  ([f4469fe0](https://github.com/adrianlee44/lorax/commit/f4469fe05409d5bfd0f8e45b778f590403b88c85))
  - Clean up getLog function
  ([c9fbbf9c](https://github.com/adrianlee44/lorax/commit/c9fbbf9c3fc5549f95ebdfb15a66a7c2150577ee))
  - Clean up code and update to es2015
  ([65e71888](https://github.com/adrianlee44/lorax/commit/65e718885e3dd3c39d1695d4b0261b68d7186ae6))
  - Clean up existing code
  ([2e5ccba5](https://github.com/adrianlee44/lorax/commit/2e5ccba5f9467a0d07678709bf009fdf211a5337))
  - Return empty string when no commit is provided
  ([c774cffa](https://github.com/adrianlee44/lorax/commit/c774cffa12e6c7aa6062d4b82f06de6c5676520e))
  - Create issue link only if issue number is passed
  ([628d6b25](https://github.com/adrianlee44/lorax/commit/628d6b25a20160a4257c9ba4d7183de71605607f))
  - Cleaned up code for getting git log
  ([ed673058](https://github.com/adrianlee44/lorax/commit/ed6730587bc9c1414910b3bccdc7240b8062f57b))
  - Converted Coffeescript to Javascript
  ([c9063335](https://github.com/adrianlee44/lorax/commit/c9063335435907228ba3cf6ac6a82e0d41374ff8))


# v0.1.3 (2014/1/5)
## Features
- **lorax:** Allow specifying tag when reading log
  ([0dff7d0d](https://github.com/adrianlee44/lorax/commit/0dff7d0d635ca5b920864cb73d0f4075227cf162))

# v0.1.2 (2014/1/5)
## Bug Fixes
- **lorax:**
  - Fixed not able to parse multiple issues
  ([0d3a6e5c](https://github.com/adrianlee44/lorax/commit/0d3a6e5cb07fcc117fe8bb4ce348a5818ca687b8))
  - Fixed not parsing special characters in component name
  ([8911a1cf](https://github.com/adrianlee44/lorax/commit/8911a1cfd8d43dfb5d78774697a51ee46c52bcbb))

## Features
- **config:** Allow setting with an object
  ([84ae8ae7](https://github.com/adrianlee44/lorax/commit/84ae8ae702ba831c59daf60fdb9874d012e20667))
- **lorax:** Updated API to include git and Config module
  ([72e47af9](https://github.com/adrianlee44/lorax/commit/72e47af9a37cf29baf807da53fde54f9e888ee47))

## Optimizations
- **lorax:** Refactored lorax to make API easier to use
  ([070c798d](https://github.com/adrianlee44/lorax/commit/070c798dc663bee0b0e44cef6893e21daf24fe4a))

# v0.1.1 (2014/1/5)
## Optimizations
- **lorax:** Refactored lorax to make API easier to use
  ([070c798d](https://github.com/adrianlee44/lorax/commit/070c798dc663bee0b0e44cef6893e21daf24fe4a))

# v0.1.0 (2013/12/13)
## Features
- **all:** Initial commit
  ([c1cffd76](https://github.com/adrianlee44/lorax/commit/c1cffd76f985bf267bb1983002ab368129a11735))
- **config:** Allow custom path
  ([86c84897](https://github.com/adrianlee44/lorax/commit/86c8489714c31414eef38a45c790f2ae54d3af74))
- **git:** Updated getLog function so read all logs when no tag is provided
  ([997fe15d](https://github.com/adrianlee44/lorax/commit/997fe15d42e5f59264edc7e8291c97785d5988f0))
- **lorax:**
  - Fully support gfm for closing issues
  ([d5b66a21](https://github.com/adrianlee44/lorax/commit/d5b66a21ccb423fc05d677364eac4b29d0ee95c0))
  - Added creating markdown format changelog and shortcut generate function
  ([db035b70](https://github.com/adrianlee44/lorax/commit/db035b701201c5f2db8434cb16ad1a337a9d616d))
