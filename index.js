var hindex = require('hyperlog-index')
var calendar = require('calendar-db')
var sub = require('subleveldown')
var duplexify = require('duplexify')
var once = require('once')
var xtend = require('xtend')

var DEX = 'd', CAL = 'c'

module.exports = Cal

function Cal (opts) {
  var self = this
  if (!(this instanceof Cal)) return new Cal(opts)
  var cal = self.cal = calendar(sub(opts.db, CAL))
  var map = opts.map || function (row) { return row.value }
  self.log = opts.log
  self.dex = hindex({
    log: self.log,
    db: sub(opts.db, DEX),
    map: function (row, next) {
      next = once(next)
      map(row, function (err, doc) {
        if (err) return next(err)
        else if (!doc) return next()
        else if (doc.time) ondoc(null, doc)
        else if (doc.key) self.log.get(doc.key, onget)
        else ondoc(null, doc)

        function onget (err, row) {
          if (err) return next(err)
          else ondoc(null, xtend(row.value, {
            key: row.key,
            type: doc.type,
            links: doc.links
          }))
        }
      })

      function ondoc (err, doc) {
        if (err) return next(err)
        if (!doc) return next()

        var time = doc.time
        var batch = []
        var pending = 1 + row.links.length
        row.links.forEach(function (link) {
          cal.get(link, function (err, ldoc) {
            if (err && err.notFound) return next()
            else if (err) return next(err)
            batch.push.apply(batch, cal.prepare(ldoc.time, {
              type: 'del',
              id: link,
              created: ldoc.created
            }).batch)
            if (--pending === 0) done(batch, doc)
          })
        })
        if (--pending === 0) done(batch, doc)
      }

      function done (batch, doc) {
        if (doc.time) {
          batch.push.apply(batch, cal.prepare(doc.time, {
            type: doc.type || 'put',
            id: row.key,
            created: doc.created,
            value: doc.value
          }).batch)
        }
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
