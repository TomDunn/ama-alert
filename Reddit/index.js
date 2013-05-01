var _       = require('underscore'),
    Text    = require('../Text'),
    BB      = require('backbone');

module.exports  = {};

var RedditLink = BB.Model.extend({
    getWords:    function(key) {
        return Text.tokenize(this.get(key));
    }
});

var RedditLinkCollection = BB.Collection.extend({
    model: RedditLink
});

module.exports = {
    RedditLink:             RedditLink,
    RedditLinkCollection:   RedditLinkCollection
};
