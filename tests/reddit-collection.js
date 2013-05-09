#!/usr/bin/env node

var RedditLinkCollection = require('../Reddit').RedditLinkCollection;
var _                    = require('underscore');
var async                = require('async');

var r = new RedditLinkCollection();
var test = function(cb) {
    var success = function(collection,res,options) {
        r.getAttr('url').query.after = r.getThingId(r.last().id);
        console.log(r.getAttr('url'));
        _.delay(cb,2000);
    };

    var error   = function(c,r,o) {
        cb('FUCK');
    };

    r.fetch({success:success, error:error, remove:false});
};

r.getAttr('url').query.limit = 100;
async.whilst(
    function() { return r.length < 1000; },
    test,
    function(err) {
        if (err)
            console.log(err);

        console.log(r.length);
    }
);
