#!/usr/bin/env node
/**
 * @author Seena Rowhani
 * @description Auto-generate test scaffolding using JIRA
 */
;(function (program, Jira, utils) {
  module.exports = {
    name: 'ember-barista',
    includedCommands () {
      return {
        barista: {
          name: 'barista',
          description: `
            Make your life easier.
            Generates tests based on jira issues.
          `,
          works: 'insideProject',
          run (options, args) {
            utils.init(program)
            let color = utils.chalk.magenta
            console.log(utils.chalk.yellow(`
            Ember Barista
                 )))
                (((
              +-----+
              |     |]
              \`-----\'
            `))
            return utils.prompt([{
                type: 'input',
                name: 'issue',
                message: color('Issue Number:')
              }, {
                type: 'input',
                name: 'user',
                message: color('Username:')
              }, {
                type: 'password',
                name: 'pass',
                message: color('Password:')
              }
            ]).then(answers => {
              let jira = new Jira({
                protocol: 'https',
                host: program.host || process.env.JIRA_HOST,
                username: answers.user || process.env.JIRA_USER,
                password: answers.pass || process.env.JIRA_PASS,
                apiVersion: '2',
                strictSSL: true
              })
              return jira.findIssue(answers.issue || process.env.JIRA_ISSUE)
                .then(issue => {
                  let comments = issue.fields.comment.comments
                  comments = comments
                    .map(utils.parse)
                    .filter(utils.validate)
                  if (!comments.length)
                    utils.error(
                      `No valid 'barista' commands were found in ${issue.key}`
                    )
                  comments.forEach(comment => {
                      let
                        name       = Object.keys(comment)[0],
                        tests      = comment[name],
                        title      = name.replace(/(.*)\|(.*)/, "$2").trim()
                        dasherized = utils.string(title.toLowerCase(), 'dasherize')
                        camelized  = utils.string(title, 'camelize')

                      return utils.compile('suite', {
                        title,
                        dasherized,
                        camelized,
                        tests,
                      }).then(final => {
                        let testDir = `${this.project.root}/tests/acceptance`
                        try {
                          utils.exec(`mkdir ${testDir}`)
                        } catch(e) {}
                        let file = `${testDir}/${camelized}Test.js`
                        utils.write(file, final)
                        console.log(
                          utils.chalk.green(
                            `Succesfully wrote file to ${file}`
                          )
                        )
                      })
                    })
                }).catch(utils.error)
            })
          }
        }
      }
    }
  }
})(
  require('commander'),
  require('jira-client'),
  require('./utils/util')
);
