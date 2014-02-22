module.exports = function() {
    var events = {};
    var dates = {};

    function handle(event) {
        var currentDate = dates[event.id];
        var newDate = Date.parse(event.date);

        if (!currentDate || newDate >= currentDate) {
            events[event.id] = event;
            dates[event.id] = newDate;
        }
    }

    function addedEvents() {
        var addedEvents = [];

        for (var key in events) {
            if (events[key].action === 'add') {
                addedEvents.push(events[key]);
            }
        }

        return addedEvents;
    }
    
    function latest() {
        return addedEvents();
    }

    latest.process = function(event) {
        if (Array.isArray(event)) {
            event.forEach(handle);
        } else {
            handle(event);
        }
    };

    return latest;
}
