module.exports = function(BB, Link, _, url) {
    var RedditLinkCollection = BB.Collection.extend({
        model: Link,

        parse: function(response, options) {
            return _.map(response.data.children, function(child) {
                return child.data;
            });
        },

        getThingId: function(id) {
            return "t3_" + id;
        }

    });

    return RedditLinkCollection;
};
