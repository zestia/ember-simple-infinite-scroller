# Changelog

## 9.2.3

- Run ember-cli-update
- Upgrade dependencies
- Convert tests to `.gjs`

## 9.2.2

- Update `@zestia` scoped packages

## 9.2.1

- Re-release of 9.2.0 but published to GH Packages instead of NPM

## 9.2.0

- Run `ember-cli-update`

## 9.1.0

- Remove BEM classes in favour of data attributes

## 9.0.0

- Ember Auto Import 2x
- Removed `setElement`
- Run ember-cli-update

## 8.1.0

- Upgrade dependencies
- Add Embroider support
- Expose `scrollToPercentage` test helper

## 8.0.2

- Upgrade dependencies

## 8.0.1

- Make sure component is not in a loading state if there is a failure to load more.

## 8.0.0

- Release changes from beta 8

## 8.0.0-beta.0

- Removes `@selector` in favour of `@element`
- Removes `@useDocument` in favour of `@element`
- Removes `scroller.error`
- Renames `@scrollDebounce` to `@debounce`
- Renames `@leeway` to `@percent`. This is the inverse!
- Adds `scroller.setElement` to make setting child elements easier
- Upgrades dependencies

## 7.0.7

- Fix division by zero

## 7.0.6

- Run ember-cli-update

## 7.0.5

- Upgrade dependencies

## 7.0.4

- Upgrade dependencies

## 7.0.3

- Upgrade dependencies

## 7.0.2

- Upgrade dependencies

## 7.0.1

- Upgrade dependencies
- Run prettier

## 7.0.0

- Glimmerise component
- Drop support for Ember < 3.16

## 6.0.6

- Upgrade dependencies

## 6.0.5

- Upgrade dependencies

## 6.0.4

- Fix illegal invocation of requestAnimationFrame

## 6.0.3

- Fix forced reflow during initial render
- Move render modifiers to dependencies
- Upgrade dependencies

## 6.0.2

- Upgrade dependencies

## 6.0.1

- Turn off debug mode
- Add test to prevent publishing with debug mode on

## 6.0.0

- Re-computes `scroller.isScrollable` after new content is loaded
- Drop support for < Ember 3.11

## 5.0.0

- Switch to BEM syntax
- Upgrade dependencies

## 4.0.1

- Upgrade dependencies

## 4.0.0

- Update templates
- Upgrade dependencies
- Must be invoked using angle brackets for attributes to be forwarded

## 3.0.10

- Upgrade dependencies

## 3.0.9

- Upgrade dependencies

## 3.0.8

- Upgrade dependencies

## 3.0.7

- Upgrade ember-cli

## 3.0.6

- Add `isScrollable` property to yielded 'api'

## 3.0.5

- Small tweaks to debug logging

## 3.0.4

- Support FastBoot

## 3.0.3

- Give default value of `false` to yielded `isLoading` property

## 3.0.2

- Correct left over mentions of `useElement`. Which should now be `selector`

## 3.0.1

- Fix for versions <= 2.18

## 3.0.0-beta.1

- Change to camelCase component arguments
- Fix bug where the load more action would not fire with `use-document=true`. This could happen if there was other content on the page, that was longer than infinite scroller content (i.e. the bottom of the document would not get hit)
- Changed `trigger-at` to `leeway` to account for differences in the 'bottom detection' depending on the mode.
  - To upgrade, if you were originally triggering load more at 95%, then your leeway would be 5%.

## 2.0.2

- Fix mismatch between github tag and published module

## 2.0.1

- Fix detection of the bottom of the document in Safari

## 2.0.0

- Introduce `use-element`

## 1.0.20

- Re-release due to dodgy publish

## 1.0.19

- Upgrades ember-cli

## 1.0.18

- Bug fixes (`use-document` technique was broken in 1.0.17)

## 1.0.17

- Reduce reliance on jQuery

## 1.0.16

- Fix travis builds
- Fix dependencies

## 1.0.15

- Lint everything

## 1.0.12

- Upgrade devDependencies

## 1.0.11

- Upgrade devDependencies

## 1.0.10

- upgrade deps & fix build

## 1.0.9

- move ember-improved-cp to dependencies

## 1.0.8

- eslint

## 1.0.7

- Cancel debounce when destroyed

## 1.0.6

- Remove use of `getAttr`

## 1.0.5

- Update devDependencies

## 1.0.1

- Update for Glimmer 2 compat

## 1.0.0

- Make sure padding is included in scroll calculations

## 0.0.4

- Upgrade ember-cli

## 0.0.3

- Improve dummy app demo

## 0.0.2

- Add ability to customise with `scroll-debounce` and `trigger-at` options.

## 0.0.1

- Initial release
