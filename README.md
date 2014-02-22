Keep latest events
==================

When add or remove events can be received out of order, but we are only
interested in the latest event that occured for a given id.

Example:

```javascript
var latest = latestEvents();

latest.process({ action: 'add', id: 1, date: firstDate });
latest.process({ action: 'remove', id: 1, date: secondDate });
latest.process({ action: 'add', id: 2, date: secondDate });

latest();
// [{ action: 'add', id: 2, date: secondDate }]
```

We can also process arrays:

```javascript
var latest = latestEvents();

var events = [
    { action: 'add', id: 1, date: firstDate },
    { action: 'remove', id: 1, date: secondDate },
    { action: 'add', id: 2, date: secondDate }
];

latest.process(events);
latest.process({ action: 'add', id: 3, date: thirdDate });

latest();
// [
//   { action: 'add', id: 2, date: secondDate },
//   { action: 'add', id: 3, date: thirdDate }
// ]
```

Install
-------

npm:

```
$ npm install --save latest-events
```

Bower:

```
$ bower install --save latest-events
```

Manually: [download file](https://raw.github.com/kjbekkelund/latest-events/master/latest.js)
