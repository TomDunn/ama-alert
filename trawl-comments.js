#!/usr/bin/env node

var Reddit = require('./Reddit');
var links = new Reddit.RedditLinkCollection();
links.loadFromFile('trawled-links.txt', function() {
    var ids = links.pluck('id');

    console.log("Loaded " + ids.length + " models");
    trawl(ids);
});

function getNext(ids) {
    return 'comments/' + ids.pop() + '.json';
}

function trawl(ids) {
    var comments = new Reddit.CommentCollection();
    comments.getAttr('url').pathname = getNext(ids);
    var t = new Reddit.Trawler({
        isDone: function() { return ids.length === 0; },
        fetchSuccessCB: function(collection, response, options) {
            collection.getAttr('url').pathname = getNext(ids);
            console.log(collection.length);
        },
        fetchErrorCB: function(collection, res, options) {
            console.log(res);
            t.run();
        },
        collection: comments
    });

    t.run();
}
