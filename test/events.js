var hyperlog = require('hyperlog')
var memdb = require('memdb')
var xtend = require('xtend')
var test = require('tape')
var collect = require('collect-stream')
var cali = require('../')

var expected = [
  { key: '5d368ce0cd31345a9bf9a0b2cb870460a2b1a1adbb651af1323afec1c0a1458f',
    time: 'Tue Jan 05 2016 19:00:00 GMT+0100 (CET)',
    value: { title: 'hardware hack night' } },
  { key: 'c4c5ecdb896d0a13777d701e3dc8bed3e64a2b54812c9f8537c540bdef699fde',
    time: 'Thu Jan 07 2016 19:00:00 GMT+0100 (CET)',
    value: { title: 'javascript study group' } },
  { key: '5d368ce0cd31345a9bf9a0b2cb870460a2b1a1adbb651af1323afec1c0a1458f',
    time: 'Tue Jan 12 2016 19:00:00 GMT+0100 (CET)',
    value: { title: 'hardware hack night' } },
  { key: 'c4c5ecdb896d0a13777d701e3dc8bed3e64a2b54812c9f8537c540bdef699fde',
    time: 'Thu Jan 14 2016 19:00:00 GMT+0100 (CET)',
    value: { title: 'javascript study group' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Fri Jan 15 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Sat Jan 16 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Sun Jan 17 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Mon Jan 18 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Tue Jan 19 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: '5d368ce0cd31345a9bf9a0b2cb870460a2b1a1adbb651af1323afec1c0a1458f',
    time: 'Tue Jan 19 2016 19:00:00 GMT+0100 (CET)',
    value: { title: 'hardware hack night' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Wed Jan 20 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Thu Jan 21 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'c4c5ecdb896d0a13777d701e3dc8bed3e64a2b54812c9f8537c540bdef699fde',
    time: 'Thu Jan 21 2016 19:00:00 GMT+0100 (CET)',
    value: { title: 'javascript study group' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Fri Jan 22 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Sat Jan 23 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Sun Jan 24 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Mon Jan 25 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Tue Jan 26 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: '5d368ce0cd31345a9bf9a0b2cb870460a2b1a1adbb651af1323afec1c0a1458f',
    time: 'Tue Jan 26 2016 19:00:00 GMT+0100 (CET)',
    value: { title: 'hardware hack night' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Wed Jan 27 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Thu Jan 28 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'c4c5ecdb896d0a13777d701e3dc8bed3e64a2b54812c9f8537c540bdef699fde',
    time: 'Thu Jan 28 2016 19:00:00 GMT+0100 (CET)',
    value: { title: 'javascript study group' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Fri Jan 29 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } },
  { key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
    time: 'Sat Jan 30 2016 12:00:00 GMT+0100 (CET)',
    value: { title: 'cyberwizard institute' } }
]

test('events', function (t) {
  t.plan(2)
  var log = hyperlog(memdb(), { valueEncoding: 'json' })
  var cal = cali({
    log: log,
    db: memdb(),
    map: function (row) {
      return xtend(row, {
        type: 'put',
        time: row.value.time,
        created: row.value.created,
        value: { title: row.value.title }
      })
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

  var q = { gt: '2016-01-01', lt: '2016-01-31' }
  collect(cal.query(q), function (err, docs) {
    t.error(err)
    t.deepEqual(docs.map(format), expected.map(format), 'expected events')
  })
  function format (doc) {
    return {
      key: doc.key,
      time: doc.time.toString(),
      value: doc.value
    }
  }
})
