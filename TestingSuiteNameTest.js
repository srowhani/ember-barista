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
  beforeEach(function() {
    application = startApp()
  })

  afterEach(function() {
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
