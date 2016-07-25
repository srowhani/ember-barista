[ci-img]: https://img.shields.io/travis/ciena-blueplanet/ember-barista.svg "Travis CI Build Status"
[ci-url]: https://travis-ci.org/ciena-blueplanet/ember-barista
[cov-img]: https://img.shields.io/coveralls/ciena-blueplanet/ember-barista.svg "Coveralls Code Coverage"
[cov-url]: https://coveralls.io/github/ciena-blueplanet/ember-barista
[npm-img]: https://img.shields.io/npm/v/ember-barista.svg "NPM Version"
[npm-url]: https://www.npmjs.com/package/ember-barista
  
# eslint-config-frost-standard <br /> [![Travis][ci-img]][ci-url] [![Coveralls][cov-img]][cov-url] [![NPM][npm-img]][npm-url]

# ember-barista

Tool to make life easier.

In Jira, add a comment in the following format.

```yaml
Acceptance Criteria | Testing Suite Name:
  - Username Input | Fillable:
      Before:
        - Create Text Field
        - Assign ID
        - Set disabled
      Tests:
        - Fires input event
        - Focus and blur events:
          - Does this
          - Does that
          - Keeps Nesting:
            - Nested does this
            - Nested does that
  - Password Field | Triggerable:
      Before:
        - Create Text Field
      Tests:
        - Fires input event
        - Focus and blur events:
          - Does this
          - Does that
          - Keeps Nesting:
            - Nested does this
            - Nested does that
```

Will generate a test in the following format:

```js
import chai from 'chai'
import sinon from 'sinon'

import {
  beforeEach,
  afterEach,
  it
} from 'mocha'

import {
  create,
  fillable,
  triggerable
} from 'ember-cli-page-object'

const expect = chai.expect

const PageObject = create({
  'username-input': fillable('.username-input'),
  'password-field': triggerable('.password-field')
})

describe('Acceptance: Testing Suite Name', function () {
  beforeEach(function () {
    application = startApp()
  })

  afterEach(function () {
    destroyApp(application)
  })

  describe('Username Input | Fillable', function () {
    beforeEach(function () {
      // TODO Create Text Field
      // TODO Assign ID
      // TODO Set disabled
    })
    it('Fires input event', function () {})
    describe('Focus and blur events', function () {
      it('Does this', function () {})
      it('Does that', function () {})
      describe('Keeps Nesting', function () {
        it('Nested does this', function () {})
        it('Nested does that', function () {})
      })
    })
  })
  describe('Password Field | Triggerable', function () {
    beforeEach(function () {
      // TODO Create Text Field
    })
    it('Fires input event', function () {})
    describe('Focus and blur events', function () {
      it('Does this', function () {})
      it('Does that', function () {})
      describe('Keeps Nesting', function () {
        it('Nested does this', function () {})
        it('Nested does that', function () {})
      })
    })
  })
})
```
## Installation

* `npm install`

## Running

`./index.js`

## TODO

- Generate files in correct location (relative path to node_modules)
- Automation
