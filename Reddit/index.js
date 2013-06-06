var _       = require('underscore'),
    Natural = require('natural'),
    BB      = require('backbone'),
    url     = require('url');

BB.$        = require('jquery');

/* extend the basic backbone collection further */
require('./base-collection')(BB, _, url);

/* override the sync method to send additional headers */
BB.origSync = BB.sync;
BB.sync = function() {
    var xhr = BB.origSync.apply(this, arguments);
    xhr.setRequestHeader('User-Agent', 'RediTrawl by u/lungfungus');
    return xhr;
};

/* set up the tokenizer */
var tokenizer = new Natural.WordTokenizer();

/* Links */
var RedditLink           = require('./Link/model')(BB, tokenizer.tokenize.bind(tokenizer));
var RedditLinkCollection = require('./Link/collection')(BB, RedditLink, _, url);

/* Comments */
var CommentCollection = require('./Comment/collection')(BB, _);

module.exports = {
    RedditLink:             RedditLink,
    RedditLinkCollection:   RedditLinkCollection,
    CommentCollection:      CommentCollection,
    Trawler:                require('./trawler')
};
