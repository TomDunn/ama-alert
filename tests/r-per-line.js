#!/usr/bin/env node

var Lazy = require('lazy'),
    fs   = require('fs'),
    argv = require('optimist').argv,
    _    = require('underscore');

function removeNewlines(string) {
    return string.replace(/\r?\n|\r/g, " ");
}

var categorized = {};

function normalizeLine(line) {
    line = JSON.parse(line.toString());
    var sub = line.subreddit;

    if (! _.has(categorized, sub)) {
        categorized[sub] = sub + ' ';
    }

    categorized[sub] = categorized[sub] + removeNewlines([line.title, line.selftext, line.domain].join(' ')) + ' ';
}

function done() {
    console.log(_.reduce(_.values(categorized), function(memo, sub) {
        return memo + sub + '\n';
    }, ''));
}

var infile = argv.infile || 'trawled-links.txt';
new Lazy(fs.createReadStream(infile))
    .on('end', done)
    .lines
    .forEach(normalizeLine);
