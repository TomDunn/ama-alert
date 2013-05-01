#!/usr/bin/env node

var JSONStream  = require('JSONStream');
var request     = require('request');
var Text        = require('./Text');
var _           = require('underscore');

var db          = require('./db.js');
var Models      = db.Models;
db = db.db;
var fs          = require('fs');

//request({url: 'http://reddit.com/r/ama.json'})
function checkForAMAs() {
    console.log('checking');
    var posts           = [];
    var matched_posts   = [];
    request({url: 'http://reddit.com/r/ama/new.json?limit=100'})
        .pipe(JSONStream.parse('data.children.*.data'))
        .on('data', function(chunk) {
            posts.push({
                titleWords: Text.tokenize(chunk.title),
                id:         chunk.id,
                score:      chunk.score
            });
        })
        .on('end', function() {
            Models.Rule.find().stream().on('data', function(rule) {

                _.each(posts, function(post) {

                    if (rule.containsOneOf(post.titleWords) &&
                        rule.containsNoneOf(post.titleWords) &&
                        rule.containsAllOf(post.titleWords) &&
                        rule.minScore <= post.score) {
                        matched_posts.push({
                            uid:    rule.owner,
                            postId: post.id,
                            ruleId: rule.id,
                            oneOf:  rule.oneOf,
                            title:  post.titleWords
                        });
                    }

                });
            })
            .on('end', function() {
                var notifications = [];

                _.each(matched_posts, function(match) {
                    notifications.push({
                        owner:      match.uid,
                        title:      match.title.join(' '),
                        postId:     match.postId
                    });
                });

                Models.Notification.create(notifications, function(err) {
                    if (err)
                        console.log(err);
                });
            });
        });
};

checkForAMAs();
setInterval(checkForAMAs, 40000);
