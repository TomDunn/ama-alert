var _ = require('underscore');
module.exports = function(BB) {

    var model = BB.Model.extend({
        flatten: function() {
            var flatNodes = [];
            var traverse = function(comment) {
                var replies = comment.replies;
                comment.replies = null;
                flatNodes.push(comment);

                if (replies)
                    _.each(replies, function(reply) { traverse(reply); });
            }

            traverse(_.deepClone(this.attributes));
            return flatNodes;
        }
    });

    return model;
};
