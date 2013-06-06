#!/usr/bin/env node

var Reddit = require('./Reddit'),
    async  = require('async'),
    _      = require('underscore'),
    argv   = require('optimist').argv;

var links       = new Reddit.RedditLinkCollection();
var comments    = new Reddit.CommentCollection();

var parallelTasks = [function(cb) {
    links.loadFromFile('trawled-links.txt', function() {
        console.log("Loaded " + links.length + " links");
        cb();
    });
}];

if (argv.load) {
    parallelTasks.push(function(cb) {
        console.log("loading comments");
        comments.loadFromFile('trawled-comments.txt', function() {
            cb();
        });
    });
}

async.parallel(parallelTasks, function(err,res) {
    var ids = links.pluck('id');

    if (argv.load) {
        var numLinksLeft = ids.length - _.unique(comments.pluck('link_id')).length;
        console.log('links left: ' + numLinksLeft);

        while(ids.length > numLinksLeft) {
            ids.pop();
        }
    }

    trawl(ids);
});

function getNext(ids) {
    return 'comments/' + ids.pop() + '.json';
}

function trawl(ids) {
    comments.getAttr('url').pathname = getNext(ids);
    var t = new Reddit.Trawler({
        isDone: function() { return ids.length === 0; },
        fetchSuccessCB: function(collection, response, options) {
            collection.getAttr('url').pathname = getNext(ids);
            console.log(ids.length);
        },
        fetchErrorCB: function(collection, res, options) {
            console.log(res);
            t.run();
        },
        collection: comments
    });

    comments.on('trawl-done', function() {
        comments.saveAsFile('trawled-comments.txt', function() {
            console.log("done"); 
        });
    });

    process.on('SIGINT', function() {
        comments.saveAsFile('trawled-comments.txt', function() {
            console.log('saved');
            process.exit();
        });
    });

    t.run();
}
