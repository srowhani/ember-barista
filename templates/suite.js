module.exports =
`import chai from 'chai'
import sinon from 'sinon'

import {
  beforeEach,
  afterEach,
  it
} from 'mocha'

import {
  create{{#if elements}},{{/if}}
{{imports elements}}
} from 'ember-cli-page-object'

const expect = chai.expect

const PageObject = create({
{{page elements}}
})

describe('Acceptance: {{title}}', function () {
  beforeEach(function () {
    application = startApp()
  })

  afterEach(function () {
    destroyApp(application)
  })
{{describe scenarios}}
})
`
