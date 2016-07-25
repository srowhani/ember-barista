/**
 * Convenience tool for this convenience tool.
 * @param chalk      - Makes text pretty
 * @param yaml       - Parses yaml
 * @param inquire    - prompting
 * @param Handlebars - Powerful template compiler
 * @param S          - string.js
 * @param fs         - node filesystem
 * @param types      - exec sync
 * @param types      - list of types to translate to ember-cli-page-object
 * @param package    - package.json
 * @return util
 */
;(function (chalk, yaml, inquire, Handlebars, S, fs, exec, types, package) {
  module.exports = {
    // = Properties =================
    chalk,
    yaml,
    Handlebars,
    S,
    fs,
    exec,
    package,
    // = Methods =================
    init () {
      let populate = function (content = '', tests, depth = 2) {
        if (tests instanceof Array) {
          tests.forEach(test => {
            content += populate('', test, depth + 1)
          })
          return content
        } else if (typeof tests === 'object') {
          let k = Object.keys(tests)[0]
          if (k === 'Setup' && tests[k] instanceof Array) {
            content += `${S('  ').times(depth-2)}beforeEach(function () {\n`
            tests[k].forEach(e => {
              content += `${S('  ').times(depth-1)}//TODO ${e}\n`
            })
            content += `${S('  ').times(depth-2)}})\n`
            let t = tests['Tests']
            if(t && t instanceof Array) {
              return populate(content, t, depth) + `${S(' ').times(depth)}})\n`
            }
          }
          else {
            content += `${S(' ').times(depth + 1)}describe('${k}', function () {\n`
            return populate(content, tests[k], depth + 1) + `${S(' ').times(depth + 1)}})\n`
          }
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
            let before = el[key]['Setup']
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
          let key  = Object.keys(el)[0]
          let name = S(key.toLowerCase()).dasherize().s
          if (el[key]['Type']) {
            let type = el[key]['Type'].toLowerCase().trim()
            if (types.indexOf(type) > -1) {
              content += `  '${name}': ${type}('.${name}')${elem[elem.length-1] !== el ? ',\n' : ''}`
            }
          }
        })
        return new Handlebars.SafeString(content)
      })
      Handlebars.registerHelper('imports', function (elem, options) {
        let content = ''
        let o = {}
        elem = elem.filter(el => {
          let key  = Object.keys(el)[0]
          if (el[key]['Type']) {
            let type = el[key]['Type'].toLowerCase().trim()
            if (types.indexOf(type) > -1 && !o[type]) {
              return o[type] = true
            }
          }
        })
        elem.forEach(el => {
          let key  = Object.keys(el)[0]
          let type = el[key]['Type'].toLowerCase().trim()
          content += `  ${type}${elem[elem.length-1] !== el ? ',\n' : ''}`
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
      return new Promise((resolve, reject) => {
        try {
          resolve(Handlebars.compile(require(`../templates/${template}`))(data))
        } catch (e) {
          reject(e)
        }
      })
    },
    write: fs.writeFileSync,
  }
})(
  require('chalk'),
  require('js-yaml'),
  require('inquirer'),
  require('handlebars'),
  require('string'),
  require('fs'),
  require('child_process').execSync,
  require('./pagetypes'),
  require('../package.json')
);
