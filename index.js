var hindex = require('hyperlog-index')
var sub = require('subleveldown')
var parse = require('parse-messy-schedule')
var through = require('through2')
var lexi = require('lexicographic-integer')
var readonly = require('read-only-stream')

module.exports = Cal

function Cal (opts) {
  if (!(this instanceof Cal)) return new Cal(opts)
  var self = this
  self.db = opts.db
  self.xdb = sub(self.db, 'x')
  self.log = opts.log
  self.map = opts.map
  self.ix = hindex(self.log, sub(self.db, 'i'), function (row, next) {
    var time = self.map(row)
    if (!time) return next()
    var p = parse(time)
    var a = p.range[0].getTime(), b = p.range[0].getTime()
    var pa = Math.abs(a), pb = Math.abs(b)
    var xa = a < 0 ? '0' : '1'
    var xb = b < 0 ? '0' : '1'

    var lowerKey = 'lower!' + encodeDate(p.range[0]) + '!' + row.key
    var upperKey = 'upper!' + encodeDate(p.range[1]) + '!' + row.key
    self.xdb.batch([
      { type: 'put', key: upperKey, value: 0 },
      { type: 'put', key: lowerKey, value: 0 }
    ], next)
  })
}

Cal.prototype.createReadStream = function (opts) {
  // an interval or segment tree would be more appropriate
  var self = this
  var stream = through.obj(write)
  self.ix.ready(function () {
    self.xdb.createReadStream({
      gt: opts.gt ? 'lower!' + encodeDate(opts.gt) : undefined,
      lt: opts.lt ? 'lower!' + encodeDate(opts.lt) : undefined
    }).pipe(stream)
  })
  return readonly(stream)

  function write (row, enc, next) {
    var k = row.key.split('!')[2]
    self.log.get(k, next)
  }
}

function encodeDate (d) {
  var x = Math.abs(d.getTime())
  return (x < 0 ? '0' : '1') + Buffer(lexi.pack(x)).toString('hex')
}
