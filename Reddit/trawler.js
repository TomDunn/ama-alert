var _       = require('underscore'),
    async   = require('async');

function Trawler(args) {
    this.isDone         = function() { return !args.isDone(); };
    this.fetchSuccessCB = args.fetchSuccessCB;
    this.fetchErrorCB   = args.fetchErrorCB;
    this.fetchOptions   = args.fetchOptions;
    this.collection     = args.collection;
}

Trawler.prototype.run = function() {
    var that = this;
    async.whilst(this.isDone, this._trawl.bind(this), function(error) {
        if (error)
            return that.collection.trigger('trawl-error', that.collection);

        that.collection.trigger('trawl-done', that.collection);
    });
};

Trawler.prototype._trawl = function(cb) {
    var that = this;
    var success = function(collection, res, options) {
        that.fetchSuccessCB(collection, res, options);
        _.delay(cb, 2000);
    };

    var error = function(collection, res, options) {
        that.fetchErrorCB(collection, res, options);
        cb(res);
    };

    this.collection.fetch({success:success, error:error, remove:false});
};

module.exports = Trawler;
