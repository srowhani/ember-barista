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
