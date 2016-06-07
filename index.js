var hindex = require('hyperlog-index')
var calendar = require('calendar-db')
var sub = require('subleveldown')
var duplexify = require('duplexify')
var once = require('once')

var DEX = 'd', CAL = 'c'

module.exports = Cal

function Cal (opts) {
  if (!(this instanceof Cal)) return new Cal(opts)
  var cal = this.cal = calendar(sub(opts.db, CAL))
  var map = opts.map || function (row) { return row.value }
  this.dex = hindex({
    log: opts.log,
    db: sub(opts.db, DEX),
    map: function (row, next) {
      next = once(next)
      var doc = map(row)
      if (!doc) return next()
      var time = doc.time
      var batch = []
      var pending = 1 + row.links.length
      row.links.forEach(function (link) {
        cal.get(link, function (err, ldoc) {
          if (err) return next(err)
          batch.push.apply(batch, cal.prepare(ldoc.time, {
            type: 'del',
            id: link,
            created: ldoc.created
          }).batch)
          if (--pending === 0) done()
        })
      })
      if (--pending === 0) done()
      function done () {
        batch.push.apply(batch, cal.prepare(doc.time, {
          type: 'put',
          id: row.key,
          created: doc.created,
          value: doc.value
        }).batch)
        cal.db.batch(batch, next)
      }
    }
  })
}

Cal.prototype.ready = function (fn) {
  this.dex.ready(fn)
}

Cal.prototype.query = function (opts, cb) {
  var self = this
  var d = duplexify.obj()
  self.ready(function () {
    d.setReadable(self.cal.query(opts, cb))
  })
  return d
}
