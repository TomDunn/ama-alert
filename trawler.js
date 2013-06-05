#!/usr/bin/env node

var Reddit = require('./Reddit');

function test() {
    var links = new Reddit.RedditLinkCollection();
    var t = new Reddit.Trawler({
        isDone: function() { return links.length >= 500; },
        fetchSuccessCB: function(collection, response, options) {
            collection.getAttr('url').query.after = collection.getThingId(collection.last().id);
            console.log(collection.length);
        },
        fetchErrorCB: function(collection, res, options) {
            console.log(res);
            t.run();
        },
        collection: links
    });

    links.on('trawl-done', function(collection) {
        console.log('finished');
    });

    t.run();
}

test();

