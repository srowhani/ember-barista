#!/usr/bin/env node
'use strict';

/**
 * @author Seena Rowhani
 * @description Auto-generate test scaffolding using JIRA
 */
;(function (Jira, utils) {
  module.exports = {
    name: 'ember-barista',
    includedCommands: function includedCommands() {
      return {
        barista: {
          name: 'barista',
          description: '\n            Make your life easier.\n            Generates tests based on jira issues.\n          ',
          works: 'insideProject',
          run: function run(options, args) {
            var _this = this;

            utils.init(options);
            var color = utils.chalk.magenta;
            console.log(utils.chalk.yellow('\n            Ember Barista\n                 )))\n                (((\n              +-----+\n              |     |]\n              `-----\'\n            '));
            return utils.prompt([{
              type: 'input',
              name: 'host',
              message: color('Jira Server:')
            }, {
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
            }]).then(function (answers) {
              var jira = new Jira({
                protocol: 'https',
                host: answers.host || process.env.JIRA_HOST,
                username: answers.user || process.env.JIRA_USER,
                password: answers.pass || process.env.JIRA_PASS,
                apiVersion: '2',
                strictSSL: true
              });
              return jira.findIssue(answers.issue || process.env.JIRA_ISSUE).then(function (issue) {
                var comments = issue.fields.comment.comments;
                comments = comments.map(utils.preparse).map(utils.parse).filter(utils.validate);
                if (!comments.length) utils.error('No valid \'barista\' commands were found in ' + issue.key);
                comments.forEach(function (comment) {
                  var name = Object.keys(comment)[0],
                      elements = comment[name]['Elements'] || [],
                      title = name.indexOf('|') > -1 ? name.replace(/(.*)\|(.*)/, "$2").trim() || issue.fields.summary : issue.fields.summary,
                      dasherized = utils.string(title.toLowerCase(), 'dasherize'),
                      camelized = utils.string(title, 'camelize');
                  elements = Object.keys(elements).map(function (e) {
                    var o = {};
                    o[e] = elements[e];
                    return o;
                  });
                  var a = Object.keys(utils.object);
                  var scenarios = a.map(function (e) {
                    var k = e.trim().replace(/\"/g, '');
                    var obj = {};
                    obj[k] = {
                      Tests: utils.object[e].join(' ')
                    };
                    return obj;
                  });
                  return utils.compile('suite', {
                    title: title,
                    dasherized: dasherized,
                    camelized: camelized,
                    elements: elements,
                    scenarios: scenarios
                  }).then(function (final) {
                    var dir = _this.project.root + '/tests/acceptance';
                    try {
                      utils.fs.mkdirSync(dir);
                    } catch (e) {}
                    var file = dir + '/' + dasherized + '-test.js';
                    utils.write(file, final);
                    console.log(utils.chalk.green('Succesfully wrote file to ' + file));
                  }).catch(function (e) {
                    throw new Error(e);
                  });
                });
              });
            });
          }
        }
      };
    }
  };
})(require('jira-client'), require('./utils/util'));