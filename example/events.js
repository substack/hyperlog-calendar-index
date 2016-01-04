var hyperlog = require('hyperlog')
var memdb = require('memdb')
var cali = require('../')

var log = hyperlog(memdb(), { valueEncoding: 'json' })
var cal = cali({
  log: log,
  db: memdb(),
  map: function (row) {
    if (row.value.type === 'cal') return row.value.time
  }
})
log.add(null, {
  type: 'cal',
  title: 'javascript study group',
  time: 'every thursday at 7pm'
})
log.add(null, {
  type: 'cal',
  title: 'hardware hack night',
  time: 'every tuesday at 7pm'
})
log.add(null, {
  type: 'cal',
  title: 'cyberwizard institute',
  time: 'every day at 12:00 starting jan 15 until feb 10'
  //time: 'mon-fri 12:00-17:00 starting jan 5 until jan 30'
})

cal.createReadStream({
  gt: new Date('2016-01-01'),
  lt: new Date('2016-01-31')
}).on('data', console.log)
