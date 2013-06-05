#!/usr/bin/env node

var fs = require('fs');
var _  = require('underscore');
var async = require('async');
var flags  = require('optimist').argv;
var natural = require('natural');
var LinkCollection = require('../Reddit').RedditLinkCollection;

var categories = JSON.parse(fs.readFileSync('./categories.json'));

if (flags.exclude_categories) {
    categories = _.omit(categories, flags._);
    console.log(categories);
}

var collections = _.map(_.keys(categories), function(category) {
    var col = new LinkCollection();
    col.getAttr('url').query.limit = 100;
    col.setAttr('category', category);
    col.setAttr('subs', categories[category]);

    if (flags.restore) {
        col.add(JSON.parse(fs.readFileSync('data/' + category + '.bb.json')));
    }

    return col;
});

var fetches = _.reduce(collections, function(memo, collection) {
    if (flags.add) {
        return memo.concat(_.map(collection.getAttr('subs'), function(subreddit) {
            return function(cb) {
                collection.getAttr('url').pathname = subreddit + '.json';

                var success = function(c,r,o) { _.delay(cb, 1100); };
                var error = function(c,r,o) { cb(r); };

                collection.fetch({success: success, error:error, remove:false});
            };
        }));
    } else {
        return [function(cb) { cb(); } ];
    }
}, []);

async.series(fetches, function(err, results) {
    if (err) {
        console.log("ERROR!");
        return console.log(err);
    }

    //var classifier = new natural.BayesClassifier();
    var classifier = new natural.LogisticRegressionClassifier();
    _.each(collections, function(collection) {

        console.log(collection.getAttr('category') + ': ' + collection.length);

        if (flags.save) {
            fs.writeFileSync('data/' + collection.getAttr('category') + '.bb.json', JSON.stringify(collection));
        }

        collection.each(function(model) {
            classifier.addDocument(model.get('title') + ' ' + model.get('selftext'), collection.getAttr('category'));
        });
    });

    console.log('training...');
    classifier.train();
    classifier.save('classifier.json', function(err,classifier) {
        console.log('the classifier has been persisted');
    });
});
