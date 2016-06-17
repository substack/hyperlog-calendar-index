var hyperlog = require('hyperlog')
var memdb = require('memdb')
var xtend = require('xtend')
var test = require('tape')
var collect = require('collect-stream')
var strftime = require('strftime')
var cali = require('../')

var expected0 = [
  { key: '5d368ce0cd31345a9bf9a0b2cb870460a2b1a1adbb651af1323afec1c0a1458f',
    time: '2016-01-12 19:00:00',
    value: { title: 'hardware hack night' } },
  { key: 'c4c5ecdb896d0a13777d701e3dc8bed3e64a2b54812c9f8537c540bdef699fde',
    time: '2016-01-14 19:00:00',
    value: { title: 'javascript study group' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: '2016-01-15 12:00:00',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: '2016-01-16 12:00:00',
    value: { title: 'cyberwizard institute' } }
]
var expected1 = [
  { key: '5d368ce0cd31345a9bf9a0b2cb870460a2b1a1adbb651af1323afec1c0a1458f',
    time: '2016-01-12 19:00:00',
    value: { title: 'hardware hack night' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: '2016-01-15 12:00:00',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: '2016-01-16 12:00:00',
    value: { title: 'cyberwizard institute' } }
]

test('del key', function (t) {
  t.plan(5)
  var log = hyperlog(memdb(), { valueEncoding: 'json' })
  var cal = cali({
    log: log,
    db: memdb(),
    map: function (row, next) {
      if (row.value.type === 'del') {
        next(null, row.value)
      } else next(null, xtend(row, {
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
  var q = { gt: '2016-01-10', lt: '2016-01-17' }
  collect(cal.query(q), function (err, docs) {
    t.error(err)
    t.deepEqual(docs.map(format), expected0.map(format), 'before deleted')
    log.add([docs[1].key], { type: 'del', key: docs[1].key }, onadd)
  })
  function onadd (err) {
    t.error(err)
    collect(cal.query(q), function (err, docs) {
      t.error(err)
      t.deepEqual(docs.map(format), expected1.map(format), 'after deleted')
    })
  }
  function format (doc) {
    return {
      key: doc.key,
      time: strftime('%F %T', new Date(doc.time)),
      value: doc.value
    }
  }
})
