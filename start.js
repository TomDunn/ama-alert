#!/usr/bin/env node

var JSONStream  = require('JSONStream');
var request     = require('request');
var _           = require('underscore');
var Models      = require('./db.js').Models;
var RedditLinkCollection = require('./Reddit').RedditLinkCollection;

function checkForAMAs() {
    var notifications   = [];
    var linkCollection  = new RedditLinkCollection();
    request({url: 'http://reddit.com/r/ama.json?limit=100'})
        .pipe(JSONStream.parse('data.children.*.data'))
        .on('data', function(chunk) {
            linkCollection.add(chunk);
        })
        .on('end', function() {
            Models.Rule.find().stream().on('data', function(rule) {
                notifications = notifications.concat(linkCollection.filter(function(link) {
                    var words = link.getWords('title');
                    return  rule.containsOneOf(words)   &&
                            rule.containsNoneOf(words)  &&
                            rule.containsAllOf(words)   &&
                            rule.minScore <= link.get('score');
                })
                .map(function(link) {
                    return {
                        owner:  rule.owner,
                        postId: link.get('id'),
                        title:  link.get('title')
                    };
                }));
            })
            .on('end', function() {
                Models.Notification.create(notifications, function(err) {
                    console.log(err);
                    return;
                });
            });
        });
};

checkForAMAs();
setInterval(checkForAMAs, 40000);
