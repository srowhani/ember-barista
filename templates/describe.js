module.exports =
`{{#each this}}
  {{#isArray this}}
    hi
  {{> describe}}
  {{else}}
  it('{{name}}', function ({{if async 'done'}}) {
    {{#if async}}
    done()
    {{/if}}
  })
  {{/isArray}}
{{/each}}
`
