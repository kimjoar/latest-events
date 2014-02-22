var test = require('tape');
var latestEvents = require('./latestEvents');

var firstDate = "1996-07-16T19:20:30.45+01:00";
var secondDate = "1997-07-16T19:20:30.45+01:00"; 
var thirdDate = "1998-07-16T19:20:30.45+01:00"; 

test('can add events when different ids', function(t){
    t.plan(4);

    var latest = latestEvents();
    latest.process({ action: 'add', id: 1, date: firstDate });
    latest.process({ action: 'add', id: 2, date: firstDate });
    latest.process({ action: 'add', id: 3, date: secondDate });

    var events = latest();
    t.equal(events.length, 3);
    t.equal(events[0].id, 1);
    t.equal(events[1].id, 2);
    t.equal(events[2].id, 3);
});

test('can remove event when remove occurs later than add', function(t){
    t.plan(2);

    var latest = latestEvents();
    latest.process({ action: 'add', id: 1, date: firstDate });
    latest.process({ action: 'remove', id: 1, date: secondDate });
    latest.process({ action: 'add', id: 2, date: secondDate });

    var events = latest();
    t.equal(events.length, 1);
    t.equal(events[0].id, 2);
});

test('does not remove event when remove occurs earlier than add', function(t){
    t.plan(4);

    var latest = latestEvents();
    latest.process({ action: 'add', id: 1, date: secondDate });
    latest.process({ action: 'remove', id: 1, date: firstDate });
    latest.process({ action: 'add', id: 2, date: secondDate });

    var events = latest();
    t.equal(events.length, 2);
    t.equal(events[0].id, 1);
    t.equal(events[0].date, secondDate);
    t.equal(events[1].id, 2);
});

test('keep latest event if exact same date', function(t) {
    t.plan(1);

    var latest = latestEvents();
    latest.process({ action: 'add', id: 1, date: firstDate });
    latest.process({ action: 'remove', id: 1, date: firstDate });

    var events = latest();
    t.equal(events.length, 0);
});

test('can add events using an array', function(t) {
    t.plan(5);

    var someEvents = [
        { action: 'add', id: 1, date: secondDate },
        { action: 'remove', id: 1, date: firstDate },
        { action: 'add', id: 2, date: secondDate }
    ];
    var anotherEvent = { action: 'add', id: 3, date: thirdDate };

    var latest = latestEvents();
    latest.process(someEvents);
    latest.process(anotherEvent);

    var events = latest();
    t.equal(events.length, 3);
    t.equal(events[0].id, 1);
    t.equal(events[0].date, secondDate);
    t.equal(events[1].id, 2);
    t.equal(events[2].id, 3);
});

test('can register added method which notifies when event is added', function(t) {
    t.plan(2);

    var latest = latestEvents();
    latest.added = function(event) {
        t.equal(event.id, 1);
        t.equal(event.date, firstDate);
    };

    latest.process({ action: 'add', id: 1, date: firstDate });
});

test('can register removed method which notifies when event is removed', function(t) {
    t.plan(2);

    var latest = latestEvents();
    latest.removed = function(event) {
        t.equal(event.id, 1);
        t.equal(event.date, secondDate);
    };

    latest.process({ action: 'add', id: 1, date: firstDate });
    latest.process({ action: 'remove', id: 1, date: secondDate });
});
