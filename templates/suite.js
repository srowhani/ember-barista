module.exports =
`import chai from 'chai'
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
{{imports tests}}
} from 'ember-cli-page-object';

const expect = chai.expect

const PageObject = create({
{{page tests}}
})

describeComponent(
  '{{dasherized}}',
  '{{camelized}}', {
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
    {{describe tests}}
  }
)
`
