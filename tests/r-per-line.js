#!/usr/bin/env node

var async= require('async'),
    Reddit = require('../Reddit'),
    _    = require('underscore');

var comments = new Reddit.CommentCollection();
var links = new Reddit.RedditLinkCollection();
var categorized = {};

async.parallel([function(cb) {
    comments.loadFromFile('trawled-comments.txt', function() {
        cb();
    });
}, function(cb) {
    links.loadFromFile('trawled-links.txt', function() {
        cb();
    });
}], function(err,res) {

    comments.each(function(comment) {
        var link_id = comment.get('link_id');
        if (! link_id)
            return;

        var post = links.findWhere({name: link_id});

        if (! post.has('comments'))
            post.set('comments', []);

        post.set('comments', post.get('comments').concat(comment.flatten()));
    });

    links.each(toLine);
    done();
});

function removeNewlines(string) {
    return string.replace(/\r?\n|\r/g, " ");
}

function toLine(post) {
    var sub = post.get('subreddit');
    if (! _.has(categorized, sub)) {
        categorized[sub] = sub + ' ';
    }

    var comments = '';
    if (post.has('comments')) {
        comments = _.reduce(post.get('comments'), function(memo,comment) {
            return memo + ' ' + comment.body + ' ';
        }, '');
    }

    var fields = [post.get('title'), post.get('selftext'), post.get('domain'), comments];
    categorized[sub] = categorized[sub] + removeNewlines(fields.join(' '));
}

function done() {
    console.log(_.reduce(_.values(categorized), function(memo, sub) {
        return memo + sub + '\n';
    }, ''));
}
