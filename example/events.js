var hyperlog = require('hyperlog')
var memdb = require('memdb')
var xtend = require('xtend')
var cali = require('../')

var log = hyperlog(memdb(), { valueEncoding: 'json' })
var cal = cali({
  log: log,
  db: memdb(),
  map: function (row, next) {
    next(null, xtend(row, {
      type: 'put',
      time: row.value.time,
      created: row.value.created,
      value: { title: row.value.title }
    }))
  }
})
log.add(null, {
  title: 'javascript study group',
  time: 'every thursday at 7pm'
})
log.add(null, {
  title: 'hardware hack night',
  time: 'every tuesday at 7pm'
})
log.add(null, {
  title: 'cyberwizard institute',
  time: 'every day at 12:00 starting jan 15 until feb 10',
  created: '2015-12-25'
})

cal.query({
  gt: '2016-01-01',
  lt: '2016-01-31'
}).on('data', console.log)
