# ember-barista

Tool to make life easier.

In Jira, add a comment in the following format.

```yaml
Acceptance Criteria:

  Elements:
    - Username:
        Type: Fillable
        Properties: Required, 1-100 chars, special chars
    - Submit Button:
        Type: Clickable
        Properties: Tertiary button style, resizes
    - Home Link:
        Type: Visitable
        Properties: Highlight on hover
    - Email:
        Type: fillable
        Properties: Required, 1-100 chars, reserved special chars (“@”, “-”, “_”, “.”)

  Scenarios:
    - Username Input:
        Setup:
          - Create Text Field
          - Assign ID
          - Set disabled
        Tests:
          - Fires input event
          - Focus and blur events:
            - Does this
            - Does that
            - Keeps Nesting:
                Setup:
                  - Make sure is nested
                Tests:
                  - Nested does this
                  - Nested does that
    - Password Field:
        Setup:
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
  clickable,
  visitable
} from 'ember-cli-page-object'

const expect = chai.expect

const PageObject = create({
  'username': fillable('.username'),
  'submit-button': clickable('.submit-button'),
  'home-link': visitable('.home-link'),
  'email': fillable('.email')
})

describe('Acceptance: Test BDD Story', function () {
  beforeEach(function () {
    application = startApp()
  })

  afterEach(function () {
    destroyApp(application)
  })

  describe('Username Input', function () {
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
        beforeEach(function () {
          //TODO Make sure is nested
        })
        it('Nested does this', function () {})
        it('Nested does that', function () {})
      })
      })
    })
  })
  describe('Password Field', function () {
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
