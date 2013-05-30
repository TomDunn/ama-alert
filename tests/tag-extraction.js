#!/usr/bin/env node

var fs  = require('fs');
var _   = require('underscore');
var natural = require('natural');
var argv    = require('optimist').argv;

var tok = new natural.WordTokenizer();
tok = tok.tokenize.bind(tok);

var tokenizeAndStem = natural.PorterStemmer.tokenizeAndStem;

var homebrewing = JSON.parse(fs.readFileSync('./data/homebrewing-listing.json'));
var gaming      = JSON.parse(fs.readFileSync('./data/gaming-listing.json'));
var gonewild    = JSON.parse(fs.readFileSync('./data/gonewild-listing.json'));

function childData(child)       { return child.data; }
function reduceLinks(memo, link){ return memo + link.title + ' ' + link.selftext + ' ';}

homebrewing = _.map(homebrewing.data.children, childData);
gaming      = _.map(gaming.data.children,      childData);
gonewild    = _.map(gonewild.data.children,    childData);

homebrewing = _.reduce(homebrewing, reduceLinks);
gaming      = _.reduce(gaming,      reduceLinks);
gonewild    = _.reduce(gonewild,    reduceLinks);

function reduceComments(listing) {
    if (!listing) return '';

    return _.reduce(listing.data.children, function(memo, child) {
        return memo + child.data.body + ' ' + reduceComments(child.data.replies) + ' ';
    }, '');
}

gonewild = gonewild + ' ' + reduceComments(JSON.parse(fs.readFileSync('./data/gonewild-comments.json'))[1]);
gonewild = gonewild + ' ' + reduceComments(JSON.parse(fs.readFileSync('./data/gonewild-comments1.json'))[1]);

gaming = gaming + ' ' + reduceComments(JSON.parse(fs.readFileSync('./data/gaming-comments.json'))[1]);
gaming = gaming + ' ' + reduceComments(JSON.parse(fs.readFileSync('./data/gaming-comments1.json'))[1]);

homebrewing = homebrewing + ' ' + reduceComments(JSON.parse(fs.readFileSync('./data/homebrewing-comments.json'))[1]);
homebrewing = homebrewing + ' ' + reduceComments(JSON.parse(fs.readFileSync('./data/homebrewing-comments1.json'))[1]);
homebrewing = homebrewing + ' ' + reduceComments(JSON.parse(fs.readFileSync('./data/homebrewing-comments2.json'))[1]);
homebrewing = homebrewing + ' ' + reduceComments(JSON.parse(fs.readFileSync('./data/homebrewing-comments3.json'))[1]);

var tfidf = new natural.TfIdf();

tfidf.addDocument(homebrewing);
tfidf.addDocument(gaming);
tfidf.addDocument(gonewild);

function measures(i,measure) { console.log ('document# ' + i + ' is ' + measure); }

if (argv._.length > 0) {
    _.each(argv._, function(keyword) {
        tfidf.tfidfs(keyword, measures);
        console.log('--------------------');
    });
}

if (argv.discover) { 
    var words = _.unique(tok(homebrewing));
    _.each(words, function(word) {
        tfidf.tfidfs(word, function(i, measure) {
            if (measure > 5 && i == 0) {
                console.log('Doc# ' + i + '; ' + word + ': ' + measure);
            }
        });
    });
    words = _.unique(tok(gaming));
    _.each(words, function(word) {
        tfidf.tfidfs(word, function(i, measure) {
            if (measure > 5 && i == 1) {
                //console.log('Doc# ' + i + '; ' + word + ': ' + measure);
            }
        });
    });
    words = _.unique(tok(gonewild));
    _.each(words, function(word) {
        tfidf.tfidfs(word, function(i, measure) {
            if (measure > 5 && i == 2) {
                //console.log('Doc# ' + i + '; ' + word + ': ' + measure);
            }
        });
    });
}
