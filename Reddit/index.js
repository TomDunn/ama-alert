var _       = require('underscore'),
    Natural = require('natural'),
    BB      = require('backbone'),
    url     = require('url');

BB.$        = require('jquery');

/* add deep cloning to underscore https://gist.github.com/echong/3861963 */
var deepClone = function(obj) {
    var func, isArr;
    if (!_.isObject(obj) || _.isFunction(obj)) {
        return obj;
    }

    if (_.isDate(obj)) {
        return new Date(obj.getTime());
    }

    if (_.isRegExp(obj)) {
        return new RegExp(obj.source, obj.toString().replace(/.*\//, ""));
    }

    isArr = _.isArray(obj || _.isArguments(obj));
    func = function(memo, value, key) {
        if (isArr) {
            memo.push(deepClone(value));
        } else {
            memo[key] = deepClone(value);
        }
        return memo;
    };
    return _.reduce(obj, func, isArr ? [] : {});
};

_.mixin({
    deepClone: deepClone
});

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
var Comment = require('./Comment/model')(BB);
var CommentCollection = require('./Comment/collection')(BB, _, Comment);

module.exports = {
    RedditLink:             RedditLink,
    RedditLinkCollection:   RedditLinkCollection,
    CommentCollection:      CommentCollection,
    Trawler:                require('./trawler')
};
