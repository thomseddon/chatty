
var stream = require('stream');
var syslog = require('node-syslog');
var util = require('util');

/**
 * Internal options
 *
 * @type {Object}
 */
var options = {
  ident: 'chatty',
  option: syslog.LOG_PID | syslog.LOG_ODELAY,
  facility: syslog.LOG_LOCAL0,
  console: false
};

/**
 * Log - wrapper for node-syslog
 *
 * @param  {[type]} priority syslog priority
 * @param  {[type]} data     Data to log
 */
var log = function (priority, data) {
  if (options.console) return console.log(data);
  syslog.init(options.ident, options.option, options.facility);
  syslog.log(priority, options.ident + ': ' + data);
  syslog.close();
};

exports.log = log;

/**
 * Internal log shortcut generator
 */
var shortcut = function (priority) {
  return function () {
    log(priority, Array.prototype.slice.call(arguments));
  }
};

/**
 * Info Shortcut
 *
 * @type {Function}
 */
exports.info = shortcut(syslog.LOG_INFO);

/**
 * Error Shortcut
 *
 * @type {Function}
 */
exports.error = shortcut(syslog.LOG_ERR);

/**
 * Debug Shortcut
 * @type {[type]}
 */
exports.debug = shortcut(syslog.LOG_DEBUG);

/**
 * Shortcut to generate a stream
 *
 * @param  {String|Integer} priority syslog priority
 * @param  {Obhect}         options  Stream options
 * @return {Object}                  LogStream
 */
exports.stream = function (priority, options) {
  return new LogStream(priority, options);
};

/**
 * Configure chatty
 *
 * @param  {Object} opts
 */
exports.configure = function (opts) {
  options = util._extend(options, opts);
};


/**
 * Log Stream Constructor
 *
 * @param {String|Integer} priority syslog priority
 * @param {Object}         options  Options passed to stream constructor
 */
function LogStream (priority, options) {
  options = options || {};

  switch (priority) {
    case 'error':
      this.priority = syslog.LOG_ERR;
      break;
    case 'debug':
      this.priority = syslog.LOG_DEBUG;
      break;
    case 'info':
    default:
      this.priority = syslog.LOG_INFO;
  }

  if (options.objectMode === undefined)
    options.objectMode = true;

  stream.Writable.call(this, options);
}

util.inherits(LogStream, stream.Writable);

/**
 * Log Stream _write
 *
 * @param  {Mixed}    chunk
 * @param  {String}   encoding
 * @param  {Function} next
 */
LogStream.prototype._write = function (chunk, encoding, next) {
  log(this.priority, util.format(chunk));
  next();
};
