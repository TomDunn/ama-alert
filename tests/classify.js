#!/usr/bin/env node

var Bayes = require('natural').BayesClassifier;
var _     = require('underscore');

var tests = [
    {text: 'This was posted earlier without artist credit. Artist is Elliot Boyette', tag: 'art'},
    {text: 'the incredibly clean 2011 Aston Martin Vantage GT4 [3000 x 2250]', tag: 'auto'},
    {text: 'I want to read a novel by Bret Easton Ellis but I am unfamiliar with his work; which should I start with', tag: 'books'},
    {text: 'Cats Rule Everything Around Me, C.R.E.A.M.... get the money', tag: 'cute'},
    {text: 'Freshly made maple bacon and cinnamon sugar donuts from Duck Donuts in the Outer Banks, NC. [OC] [4272x2848]', tag: 'food'},
    {text: 'Acoustic Demo, Brishen Thompson--The Rescue', tag: 'music'},
    {text: 'Busty Blonde gets Cumload', tag: 'pornography'},
    {text: 'Simple module for loading JSON into redis for testing', tag: 'software'},
    {text: 'Lewandowski to leave Dortmund in Summer - Agent claims Deal is Sealed', tag: 'sports'},
    {text: 'Twitters new two way authentication may not stop hackers.', tag: 'technology'}
];
Bayes.load('classifier.json', null, function(err,classifier) {
    _.each(tests, function(test) {
         console.log('Title:\n' + test.text);
         console.log('Tag:\n' + test.tag);
         console.log('Calculated:\n');
         console.log(classifier.classify(test.text));
         console.log('------------------------------------------------');
    });
});
