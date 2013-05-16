#!/usr/bin/env node

var RedditLinkCollection = require('./Reddit').RedditLinkCollection,
    _                    = require('underscore'),
    async                = require('async'),
    linkFilter           = require('./filter');

var r = new RedditLinkCollection();
var getLinks = function(cb) {
    var prevLength = r.length;
    var success = function(collection,res,options) {
        r.getAttr('url').query.after = r.getThingId(r.last().id);
        console.log(r.length);

        if (prevLength == r.length) {
            cb('stuck');
        } else {
            _.delay(cb,2000);
        }
    };

    var error   = function(coll,res,opt) {
        cb(res);
    };

    r.fetch({success:success, error:error, remove:false});
};

/* SLOPPY, needs refactored */
var cs = 0;
function run() {
    async.whilst(function() { return r.length < 300; }, getLinks, function(err) {
        if (err) {
            console.log(err);
            if (err == 'stuck') {
                var links = r;
                linkFilter(links);
                r = new RedditLinkCollection();
            }
        } else {
            var links = r;
            linkFilter(links);
            r = new RedditLinkCollection();

            if (cs == 0) {
                r.getAttr('url').pathname = 'r/all/new.json';
                cs = 1;
            } else if (cs == 1) {
                r.getAttr('url').pathname = 'r/all/rising.json';
                cs = 2;
            } else {
                cs = 0;
            }
        }
        console.log(r.getAttr('url'));
        _.delay(run, 5000);
    });
}

run();
