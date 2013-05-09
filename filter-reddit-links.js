#!/usr/bin/env node

var _       = require('underscore');
var db      = require('./db.js');
var Models  = db.Models;
db = db.db;

function filterLinkCollection(linkCollection) {
    var notifications   = [];
    Models.Rule.find().stream().on('data', function(rule) {
        notifications = notifications.concat(linkCollection.filter(function(link) {
            var words = link.getWords('title');
            return  rule.containsOneOf(words)   &&
                    rule.containsNoneOf(words)  &&
                    rule.containsAllOf(words)   &&
                    rule.minScore <= link.get('score');
        })
        .map(function(link) {
            return Models.Notification.extractFromModel(link,rule);
        }));
    })
    .on('end', function() {
        Models.Notification.create(notifications, function(err) {
            return;
        });
    });
};

module.exports = filterLinkCollection;
