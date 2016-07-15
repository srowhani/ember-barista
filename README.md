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
  describeComponent
} from 'ember-mocha'

import {
  beforeEach,
  afterEach,
  it
} from 'mocha'

import {
  create,
  fillable,
  triggerable
} from 'ember-cli-page-object';

const expect = chai.expect

const PageObject = create({
  'username-input': fillable('.username-input'),
  'password-field': triggerable('.password-field')
})

describeComponent(
  'testing-suite-name',
  'TestingSuiteName', {
    acceptance: true
  },
  function () {
    let component, sandbox

    beforeEach(function () {
      component = this.subject()
      sandbox = sinon.sandbox.create()
    })

    afterEach(function () {
      sandbox.restore()
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
  }
)
```
## Installation

* `npm install`

## Running

`./index.js`

## TODO

- Generate files in correct location (relative path to node_modules)
- Automation
