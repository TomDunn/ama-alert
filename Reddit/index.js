var _       = require('underscore'),
    Text    = require('../Text'),
    BB      = require('backbone'),
    url     = require('url');

module.exports  = {};

var RedditLink = BB.Model.extend({
    getWords:    function(key) {
        return Text.tokenize(this.get(key));
    }
});

var RedditLinkCollection = BB.Collection.extend({
    model: RedditLink,
    attrs: {},

    initialize: function(options) {
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

    parse: function(response, options) {
        return _.map(response.data.children, function(child) {
            return child.data;
        });
    },

    url: function() {
        return url.format(this.getAttr('url'));
    },

    last: function() {
        return this.at(this.length - 1);
    },

    getThingId: function(id) {
        return "t3_" + id;
    },

    setNext: function() {
        this.getAttr('url').query.after =
            this.getThingId(this.at(this.length-1).id);
    }

});

module.exports = {
    RedditLink:             RedditLink,
    RedditLinkCollection:   RedditLinkCollection
};
