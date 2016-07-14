/**
 * Convenience tool for this convenience tool.
 * @param chalk      - Makes text pretty
 * @param yaml       - Parses yaml
 * @param Handlebars - Powerful template compiler
 * @param S          - string.js
 * @param fs         - node filesystem
 * @param package    - package.json
 * @return util
 */
;(function (chalk, yaml, Handlebars, S, fs, package) {
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
      this.Handlebars.registerPartial('describe', require('../templates/describe'))
      this.Handlebars.registerPartial('before', require('../templates/before'))
      Handlebars.registerHelper('isArray', function(elem, options) {
        if(elem instanceof Array) {
          return options.fn(this)
        }
        return options.inverse(this)
      })
      let populate = function (content = '', tests, depth = 2) {
        if (tests instanceof Array) {
          tests.forEach(test => {
            content += populate('', test, depth + 1)
          })
          return content
        } else if (typeof tests === 'object') {
          console.log(tests)
          let k = Object.keys(tests)[0]
          content += `${S('  ').times(depth)}describe('${k}', function () {\n`
          return populate(content, tests[k], depth + 1) + `${S('  ').times(depth)}})\n`
        }
        return content + `${S('  ').times(depth)}it('${tests}', function () {})\n`
      }
      Handlebars.registerHelper('populate', function (elem, options) {
        let content = ''
        elem.forEach(el => {
          let key = Object.keys(el)[0]
          let tests = el[key]['Tests']
          // console.log(tests)
          content += `\n${S('  ').times(2)}describe('${key}', function () {\n`
          content += populate('', tests) + `${S('  ').times(2)}})`
        })
        // console.log(content)
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
  require('handlebars'),
  require('string'),
  require('fs'),
  require('../package.json')
);
