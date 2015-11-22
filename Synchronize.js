/**
    Used to synchronize multiple types of storage and their timestamps.

    options{
        data : {}, the state that all storage should take.
        date: int, the modified date that all storage should take
        interval : int, sync interval in milliseconds.
        callbacks : [], an ARRAY of callback functions which are to each be executed with data 
         and date as params. Each callback should be used to update a single storage medium.
    }
*/
function Synchronize(options) {
    var that = this,
        timer = false,
        interval = options.interval || 1000,
        callbacks = options.callbacks || [];
    this.mem = options.data;
    //This is to keep the changes in data from differing between syncs
    this.startSync = function() {
        if (timer) {
            (function() {})();
        } else {
            timer = setInterval(function() {
                var dataCopy = JSON.parse(JSON.stringify(that.mem));
                var _date = options.date || new Date().getTime();
                that.sync({
                    data: dataCopy,
                    date: _date
                });
            }, interval);
        }
    };
    this.stopSync = function() {
        if (timer) {
            clearInterval(timer);
            timer = false;
        }
    };
    /** sync
        opt{
            data: data to call callbacks with.
            modifiedDate : set modifiedDate to same date on all callbacks
        }
    */
    this.sync = function(opt) {
        try {
            var option = opt || {};
            var _date = option.date || new Date().getTime();
            var _data = option.data || JSON.parse(JSON.stringify(that.mem));
            var callparam = {
                date: _date,
                data: _data
            };
            if (callbacks && callbacks.push) {
                for (var i = 0; i < callbacks.length; i++) {
                    callbacks[i](callparam);
                }
            } else {
                throw "Synchronize: callbacks not passed as array.";
            }
        } catch (e) {
            console.log(e.message);
            console.log(e.stack);
        }
    };
}



//Example Usage

  var sync,
    local = {},
    remote = {},
    mem = {
        'name': 'David',
        'age': '49'
    };

sync = new Synchronize({
    data: mem,
    date: "23:42",
    interval: 1000,
    callbacks: [

        function() {
            var opt = arguments[0];
            var date = opt.date,
                data = opt.data;
            local = opt;
        },
        function() {
            var opt = arguments[0];
            var date = opt.date,
                data = opt.data;
            remote = opt;
        }
    ]

});

sync.startSync();
mem.name = 'teino boswell's;
mem.age = '37';
mem.nestedObject = {
    'properties': {
        width: 25,
        date: 'November 22nd'
    },
    'type': 'nested'
};
window.setTimeout(function() {
    console.log(memory);
    console.log(remote);
    console.log(local)
}, 1000)
