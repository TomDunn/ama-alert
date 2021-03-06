module.exports = function(BB, _, Comment) {
    return BB.Collection.extend({
        model: Comment,

        initialize: function(opts) {
            BB.Collection.prototype.initialize.call(this,opts);
            this.getAttr('url').query.limit = 500;
        },

        parse: function(response, options) {
            var response = response[1].data.children;
            var normalize = function(parent) {
                if (!parent.replies)
                    return null;

                parent.replies = _.map(parent.replies.data.children, function(child) {
                    normalize(child.data);
                    return child.data;
                });

            };

            response = _.map(response, function(child) {
                normalize(child.data);
                return child.data;
            });

            if (response.length === 0) {
                console.log("No comments found for post");
            }

            return response;
        },

        getThingId: function(id) {
            return "t1_" + id;
        }
    });
};
