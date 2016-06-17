# hyperlog-calendar-index

hyperlog index for recurring and one-time events

# example

``` js
var hyperlog = require('hyperlog')
var memdb = require('memdb')
var xtend = require('xtend')
var cali = require('hyperlog-calendar-index')

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
```

output:

```
{ key: '5d368ce0cd31345a9bf9a0b2cb870460a2b1a1adbb651af1323afec1c0a1458f',
  time: Tue Jan 05 2016 19:00:00 GMT+0100 (CET),
  value: { title: 'hardware hack night' } }
{ key: 'c4c5ecdb896d0a13777d701e3dc8bed3e64a2b54812c9f8537c540bdef699fde',
  time: Thu Jan 07 2016 19:00:00 GMT+0100 (CET),
  value: { title: 'javascript study group' } }
{ key: '5d368ce0cd31345a9bf9a0b2cb870460a2b1a1adbb651af1323afec1c0a1458f',
  time: Tue Jan 12 2016 19:00:00 GMT+0100 (CET),
  value: { title: 'hardware hack night' } }
{ key: 'c4c5ecdb896d0a13777d701e3dc8bed3e64a2b54812c9f8537c540bdef699fde',
  time: Thu Jan 14 2016 19:00:00 GMT+0100 (CET),
  value: { title: 'javascript study group' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Fri Jan 15 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Sat Jan 16 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Sun Jan 17 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Mon Jan 18 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Tue Jan 19 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: '5d368ce0cd31345a9bf9a0b2cb870460a2b1a1adbb651af1323afec1c0a1458f',
  time: Tue Jan 19 2016 19:00:00 GMT+0100 (CET),
  value: { title: 'hardware hack night' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Wed Jan 20 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Thu Jan 21 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'c4c5ecdb896d0a13777d701e3dc8bed3e64a2b54812c9f8537c540bdef699fde',
  time: Thu Jan 21 2016 19:00:00 GMT+0100 (CET),
  value: { title: 'javascript study group' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Fri Jan 22 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Sat Jan 23 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Sun Jan 24 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Mon Jan 25 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Tue Jan 26 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: '5d368ce0cd31345a9bf9a0b2cb870460a2b1a1adbb651af1323afec1c0a1458f',
  time: Tue Jan 26 2016 19:00:00 GMT+0100 (CET),
  value: { title: 'hardware hack night' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Wed Jan 27 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Thu Jan 28 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'c4c5ecdb896d0a13777d701e3dc8bed3e64a2b54812c9f8537c540bdef699fde',
  time: Thu Jan 28 2016 19:00:00 GMT+0100 (CET),
  value: { title: 'javascript study group' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Fri Jan 29 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
{ key: 'b293200589c8fc5c127b9fbe5901e0c102623598a797b8a204b1d8a1439d90cd',
  time: Sat Jan 30 2016 12:00:00 GMT+0100 (CET),
  value: { title: 'cyberwizard institute' } }
```

# api

``` js
var cali = require('hyperlog-calendar-index')
```

## var cal = cali(opts)

`opts` are:

* `opts.log` - a [hyperlog][1] to index
* `opts.db` - a [leveldb][2] to use for index storage
* `opts.map(row, next)` - a function that is called with each `row` in the hyperlog
and should call `next(err, doc)` with a falsy value or a `doc` object:

* `doc.type` - `'put'` or `'del'` (default: 'put')
* `doc.time` - the [time string][3] of the event
* `doc.created` - the time (string or `Date` object) that the `doc.time` time
string is relative to
* `doc.value` - an additional value to associate with the event (default: `{}`)

Optionally, `doc.key` can be given in place of setting `doc.time` and the rest.
This is useful for deleting records.

The default map function is `function (row) { return row.value }`.

[1]: https://npmjs.com/package/hyperlog
[2]: https://npmjs.com/package/level
[3]: https://npmjs.com/package/parse-messy-schedule

## cal.ready(fn)

Calls `fn()` when the index is caught up.

## cal.query(opts, cb)

Return a readable stream of all events between `opts.gt` and `opts.lt`,
including all instances of recurring events.

If `cb` is given, `cb(err, results)` fires with an array of all the `results`.

# install

```
npm install hyperlog-calendar-index
```

# license

BSD
