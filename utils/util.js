/**
 * Convenience tool for this convenience tool.
 * @param chalk      - Makes text pretty
 * @param yaml       - Parses yaml
 * @param inquire    - prompting
 * @param Handlebars - Powerful template compiler
 * @param S          - string.js
 * @param fs         - node filesystem
 * @param package    - package.json
 * @return util
 */
;(function (chalk, yaml, inquire, Handlebars, S, fs, package) {
  module.exports = {
    // = Properties =================
    chalk,
    yaml,
    Handlebars,
    S,
    fs,
    package,
    // = Methods =================
    init (program) {
      this.config = program
      let populate = function (content = '', tests, depth = 3) {
        if (tests instanceof Array) {
          tests.forEach(test => {
            content += populate('', test, depth + 1)
          })
          return content
        } else if (typeof tests === 'object') {
          let k = Object.keys(tests)[0]
          content += `${S(' ').times(depth + 2)}describe('${k}', function () {\n`
          return populate(content, tests[k], depth + 1) + `${S(' ').times(depth + 2)}})\n`
        }
        return content + `${S(' ').times(depth + 2)}it('${tests}', function () {})\n`
      }
      Handlebars.registerHelper('describe', function (elem, options) {
        let content = ''
        elem.forEach(el => {
          let key = Object.keys(el)[0]
          let tests = el[key]['Tests']
          if (tests) {
            content += `\n${S('  ').times(2)}describe('${key}', function () {\n`
            let before = el[key]['Before']
            if (before && before instanceof Array) {
              content += `${S('  ').times(3)}beforeEach(function () {\n`
              before.forEach(e => {
                content += `${S('  ').times(4)}// TODO ${e}\n`
              })
              content += `${S('  ').times(3)}})\n`
            }
            content += populate('', tests) + `${S('  ').times(2)}})`
          }
        })
        return new Handlebars.SafeString(content)
      })
    },
    error (err) {
      console.error(chalk.red.bold(err))
      process.exit(1)
    },
    log (msg) {
      console.log(chalk.cyan(msg))
    },
    prompt (prompts) {
      return inquire.prompt(prompts)
    },
    debug (msg) {
      if (this.config.debug) {
        this.log(`DEBUG: ${msg}`)
      }
    },
    string (text, method) {
      return S(text)[method]().s
    },
    parse (obj) {
      try {
        return yaml.load(obj.body)
      } catch (error) {
        return false
      }
    },
    validate (el) {
      return !el ?
        false :
        /Acceptance Criteria/.test(Object.keys(el)[0])
    },
    compile (template, data) {
      return Handlebars.compile(require(`../templates/${template}`))(data)
    },
    write: fs.writeFile
  }
})(
  require('chalk'),
  require('js-yaml'),
  require('inquirer'),
  require('handlebars'),
  require('string'),
  require('fs'),
  require('../package.json')
);
