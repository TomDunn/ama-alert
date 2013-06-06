var fs   = require('fs');
var Lazy = require('lazy');

module.exports = function(BB, _, url) {
    BB.Collection = BB.Collection.extend({
        initialize: function(options) {
            this.attrs = {};
            this.setAttr('url', {
                host:       'www.reddit.com',
                protocol:   'http',
                pathname:   'r/all.json',
                query:      {
                    limit:  100
                }
            });
        },

        getAttr: function(name) {
            if (_.has(this.attrs, name))
                return this.attrs[name];
            return null;
        },

        setAttr: function(name, val) {
            this.attrs[name] = val; return this;
        },

        url: function() {
            return url.format(this.getAttr('url'));
        },

        /* saves in the one JSON model per line format */
        saveAsFile: function(filename, cb) {
            fs.writeFile(filename, this.reduce(function(memo,model) {
                return memo + JSON.stringify(model) + '\n';
            }, ''), function(err) {
                if (err)
                    return cb(err);
                cb();
            });
        },

        /* loads files in the format that save does */
        loadFromFile: function(filename, cb) {
            var that = this;
            new Lazy(fs.createReadStream(filename))
                .on('end', function() { cb(); })
                .lines
                .forEach(function(line) {
                    that.add(JSON.parse(line.toString()));
                });
        },

        last: function() {
            return this.at(this.length - 1);
        }
    });
};
