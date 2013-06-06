#!/usr/bin/env node

var Reddit = require('./Reddit'),
    argv   = require('optimist').argv,
    fs     = require('fs');

function test(colctn) {
    var links = colctn || new Reddit.RedditLinkCollection();
    var limit = argv.length || 500;

    if (argv.sub)
        links.getAttr('url').pathname = argv.sub + '.json';

    if (argv.loadsubfile)
        links.getAttr('url').pathname = 'r/' + fs.readFileSync(argv.loadsubfile) + '.json';

    console.log("using reddit: " + links.getAttr('url').pathname);

    var t = new Reddit.Trawler({
        isDone: function() { return links.length >= limit; },
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
        if (argv.save) {
            links.saveAsFile(argv.outname || 'trawled-links.txt', function() {
                console.log('done');
            });
        }
    });

    process.on('SIGINT', function() {
        if (argv.save) {
            links.saveAsFile(argv.outname || 'trawled-links.txt', function() {
                console.log("finished");
                process.exit();
            });
        } else {
            console.log("No save requested");
            process.exit();
        }
    });

    t.run();
}

if (argv.loadfile) {
    var links = new Reddit.RedditLinkCollection();
    links.loadFromFile(argv.loadfile, function() {
        test(links);
    });

} else {
    test();
}
