var _   = require('underscore');

module.exports = function(mongoose) {
    var schema = new mongoose.Schema({
        name:       {type: String, default: "No named"},
        owner:      {type: Number, default: 1},
        allOf:      {type: [String], default: []},
        oneOf:      {type: [String], default: []},
        noneOf:     {type: [String], default: []},
        minScore:   {type: Number, default: 0},
        created:    {type: Date, default: Date.now},
        edited:     {type: Date, default: Date.now},
        oneOfSubs:  {type: [String], default: []},
        noneOfSubs: {type: [String], default: []}
    });

    schema.methods.matchesLinkModel = function(model) {
        var words = model.getWords('title');
    };

    schema.methods.containsOneOf = function(words) {
        if (this.oneOf.length == 1 && this.oneOf[0] == '')
            return true;

        var foundMatch = false;
        _.each(this.oneOf, function(ruleWord) {
            _.each(words, function(word) {
                if (word !== "" && word === ruleWord)
                    foundMatch = true;
            });
        });

        return foundMatch;
    };

    schema.methods.containsNoneOf = function(words) {
        if (this.noneOf.length == 1 && this.noneOf[0] == '')
            return true;

        var foundMatch = false;
        _.each(this.noneOf, function(ruleWord) {
            _.each(words, function(word) {
                if (word !== "" && word === ruleWord)
                    foundMatch = true;
            });
        });

        return !foundMatch;
    };

    schema.methods.containsAllOf = function(words) {
        var does = true;

        _.each(this.allOf, function(ruleWord) {
            var found = false;

            _.each(words, function(word) {
                if (ruleWord == '' || ruleWord == word)
                    found = true;
            });

            does = does && found;
        });

        return does;
    };

    return schema;
};
