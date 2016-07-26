'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
;(function (chalk, yaml, inquire, Handlebars, S, fs, exec, types, pkg) {
  var object = {};
  module.exports = {
    // = Properties =================
    chalk: chalk,
    yaml: yaml,
    Handlebars: Handlebars,
    S: S,
    fs: fs,
    exec: exec,
    pkg: pkg,
    object: object,
    // = Methods =================
    init: function init() {
      var populate = function populate() {
        var content = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        var tests = arguments[1];
        var depth = arguments.length <= 2 || arguments[2] === undefined ? 2 : arguments[2];

        if (tests instanceof Array) {
          tests.forEach(function (test) {
            content += populate('', test, depth + 1);
          });
          return content;
        } else if ((typeof tests === 'undefined' ? 'undefined' : _typeof(tests)) === 'object') {
          var k = Object.keys(tests)[0];
          if (k === 'Setup' && tests[k] instanceof Array) {
            content += S('  ').times(depth - 2) + 'beforeEach(function () {\n';
            tests[k].forEach(function (e) {
              content += S('  ').times(depth - 1) + '//TODO ' + e + '\n';
            });
            content += S('  ').times(depth - 2) + '})\n';
            var t = tests['Tests'];
            if (t && t instanceof Array) {
              return populate(content, t, depth) + (S(' ').times(depth) + '\n');
            }
          } else {
            content += S(' ').times(depth + 1) + 'describe(\'' + k + '\', function () {\n';
            return populate(content, tests[k], depth + 1) + (S(' ').times(depth + 1) + '})\n');
          }
        }
        return content + (S(' ').times(depth + 1) + 'it(\'' + tests + '\', function () {})\n');
      };
      Handlebars.registerHelper('describe', function (elem, options) {
        var content = '';
        elem.forEach(function (el) {
          var key = Object.keys(el)[0];
          var tests = el[key]['Tests'];
          if (tests) {
            content += '\n' + S('  ').times(1) + 'describe(\'' + key + '\', function () {\n';
            var before = el[key]['Setup'];
            if (before && before instanceof Array) {
              content += S('  ').times(2) + 'beforeEach(function () {\n';
              before.forEach(function (e) {
                content += S('  ').times(3) + '// TODO ' + e + '\n';
              });
              content += S('  ').times(2) + '})\n';
            }
            content += populate('', tests) + (S('  ').times(1) + '})');
          }
        });
        return new Handlebars.SafeString(content);
      });
      Handlebars.registerHelper('page', function (elem, options) {
        var content = '';
        elem.forEach(function (el) {
          var key = Object.keys(el)[0];
          var name = S(key.toLowerCase()).dasherize().s;
          if (el[key]['Type']) {
            var type = el[key]['Type'].toLowerCase().trim();
            if (types[type]) {
              content += '  \'' + name + '\': ' + types[type] + '(\'.' + name + '\')' + (elem[elem.length - 1] !== el ? ',\n' : '');
            }
          }
        });
        return new Handlebars.SafeString(content);
      });
      Handlebars.registerHelper('imports', function (elem, options) {
        var content = '';
        var o = {};
        console.log('elements', elem);
        elem = elem.filter(function (el) {
          var key = Object.keys(el)[0];
          if (el[key]['Type']) {
            var type = el[key]['Type'].toLowerCase().trim();
            if (types[type] && !o[types[type]]) {
              return o[types[type]] = true;
            }
          }
        });
        elem.forEach(function (el) {
          var key = Object.keys(el)[0];
          var type = el[key]['Type'].toLowerCase().trim();
          content += '  ' + types[type] + (elem[elem.length - 1] !== el ? ',\n' : '');
        });
        return new Handlebars.SafeString(content);
      });
    },
    error: function error(err) {
      console.error(chalk.red.bold(err));
      process.exit(1);
    },
    log: function log(msg) {
      console.log(chalk.cyan(msg));
    },
    prompt: function prompt(prompts) {
      return inquire.prompt(prompts);
    },
    debug: function debug(msg) {
      if (this.config.debug) {
        this.log('DEBUG: ' + msg);
      }
    },
    string: function string(text, method) {
      return S(text)[method]().s;
    },
    preparse: function preparse(obj) {
      var str = obj.body.replace(/([\w\W]+)Acceptance Criteria:([\w\W]+)/, 'Acceptance Criteria:$2');
      var pretext = str.replace(/([\w\W]+)Scenarios:([\w\W]+)/, '$1');
      var scenarios = str.replace(/([\w\W]+)Scenarios:([\w\W]+)/, '$2');
      scenarios.split('\n').forEach(function (e) {
        var matches = e.match(/"\w+"/g);

        if (matches && e.indexOf('-') < 0) {
          var m = matches.map(function (el) {
            try {
              return el.replace(/"(.*)"/, '$1').replace('\r', '');
            } catch (e) {
              return '';
            }
          });
          object[e] = m;
        }
      });
      obj.body = pretext;
      return obj;
    },
    parse: function parse(obj) {
      try {
        return yaml.load(obj.body);
      } catch (error) {
        console.log(chalk.red.bold(error));
        return null;
      }
    },
    validate: function validate(obj) {
      return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
    },
    compile: function compile(template, data) {
      console.log('compiled');
      return new Promise(function (resolve, reject) {
        try {
          resolve(Handlebars.compile(require('../templates/' + template))(data));
        } catch (e) {
          console.log(e.stack);
          reject(e);
        }
      });
    },

    write: fs.writeFileSync
  };
})(require('chalk'), require('js-yaml'), require('inquirer'), require('handlebars'), require('string'), require('fs'), require('child_process').execSync, require('./pagetypes'), require('../package.json'));