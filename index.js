#!/usr/bin/env node
/**
 * @author Seena Rowhani
 * @description Auto-generate test scaffolding using JIRA
 */
;(function (program, Jira, utils) {
  program
    .version(utils.package.version)
    .option('--host <value>', 'Jira Host (REQUIRED)')
    .option('-d, --debug', 'debug mode')
    .parse(process.argv)
  utils.init(program)
  let color = utils.chalk.magenta.bgCyan
  utils.prompt([{
      type: 'input',
      name: 'issue',
      message: color('Enter your Jira issue number:')
    }, {
      type: 'input',
      name: 'user',
      message: color('Enter your username:')
    }, {
      type: 'password',
      name: 'pass',
      message: color('Enter your password:')
    }
  ]).then((answers) => {
    let jira = new Jira({
      protocol: 'https',
      host: program.host || process.env.JIRA_HOST,
      username: answers.user || process.env.JIRA_USER,
      password: answers.pass || process.env.JIRA_PASS,
      apiVersion: '2',
      strictSSL: true
    });

    jira.findIssue(answers.issue || process.env.JIRA_ISSUE)
      .then(issue => {
        let comments = issue.fields.comment.comments
        comments
          .map(utils.parse)
          .filter(utils.validate)
          .forEach(comment => {
            let
              name       = Object.keys(comment)[0],
              tests      = comment[name],
              title      = name.replace(/(.*)\|(.*)/, "$2").trim()
              dasherized = utils.string(title.toLowerCase(), 'dasherize')
              camelized  = utils.string(title, 'camelize')

            let final = utils.compile('suite', {
              title,
              dasherized,
              camelized,
              tests,
            })

            let file = `${camelized}Test.js`
            utils.write(file, final, (err) => {
              if (err)
                utils.error(err)
              utils.log(`Successfully written file: ${file}`)
            })
          })
      }).catch(utils.error)
  })
})(
  require('commander'),
  require('jira-client'),
  require('./utils/util')
);
