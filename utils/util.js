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
    compile (data) {
      return Handlebars.compile(require('./template'))(data)
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
