/**
 * Convenience tool for this convenience tool.
 * @param chalk      - Makes text pretty
 * @param yaml       - Parses yaml
 * @param inquire    - prompting
 * @param Handlebars - Powerful template compiler
 * @param S          - string.js
 * @param fs         - node filesystem
 * @param types      - list of types to translate to ember-cli-page-object
 * @param package    - package.json
 * @return util
 */
;(function (chalk, yaml, inquire, Handlebars, S, fs, types, package) {
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
      let populate = function (content = '', tests, depth = 2) {
        if (tests instanceof Array) {
          tests.forEach(test => {
            content += populate('', test, depth + 1)
          })
          return content
        } else if (typeof tests === 'object') {
          let k = Object.keys(tests)[0]
          content += `${S(' ').times(depth + 1)}describe('${k}', function () {\n`
          return populate(content, tests[k], depth + 1) + `${S(' ').times(depth + 1)}})\n`
        }
        return content + `${S(' ').times(depth + 1)}it('${tests}', function () {})\n`
      }
      Handlebars.registerHelper('describe', function (elem, options) {
        let content = ''
        elem.forEach(el => {
          let key = Object.keys(el)[0]
          let tests = el[key]['Tests']
          if (tests) {
            content += `\n${S('  ').times(1)}describe('${key}', function () {\n`
            let before = el[key]['Before']
            if (before && before instanceof Array) {
              content += `${S('  ').times(2)}beforeEach(function () {\n`
              before.forEach(e => {
                content += `${S('  ').times(3)}// TODO ${e}\n`
              })
              content += `${S('  ').times(2)}})\n`
            }
            content += populate('', tests) + `${S('  ').times(1)}})`
          }
        })
        return new Handlebars.SafeString(content)
      })
      Handlebars.registerHelper('page', function (elem, options) {
        let content = ''
        elem.forEach(el => {
          let key = Object.keys(el)[0]
          let tests = el[key]['Tests']
          if (tests) {
            let name  = S(key.replace(/(.*)\|(.*)/, "$1").toLowerCase().trim()).dasherize().s
            let type = key.replace(/(.*)\|(.*)/, "$2").toLowerCase().trim()
            if (types.indexOf(type) > -1) {
              content += `  '${name}': ${type}('.${name}')${elem[elem.length-1] !== el ? ',\n' : ''}`
            }
          }
        })
        return new Handlebars.SafeString(content)
      })
      Handlebars.registerHelper('imports', function (elem, options) {
        let content = ''
        elem.forEach(el => {
          let key = Object.keys(el)[0]
          let tests = el[key]['Tests']
          if (tests) {
            let type = key.replace(/(.*)\|(.*)/, "$2").toLowerCase().trim()
            if (types.indexOf(type) > -1) {
              content += `  ${type}${elem[elem.length-1] !== el ? ',\n' : ''}`
            }
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
    write: fs.writeFile,
  }
})(
  require('chalk'),
  require('js-yaml'),
  require('inquirer'),
  require('handlebars'),
  require('string'),
  require('fs'),
  require('./pagetypes'),
  require('../package.json')
);
