module.exports = function(mongoose) {
    var schema =  new mongoose.Schema({
        owner:      {type: Number,  default: 1},
        created:    {type: Date,    default: Date.now},
        postId:     {type: String,  default: ''},
        title:      {type: String,  default: "DEFAULT TITLE"},
        url:        {type: String,  default: ""},
        sent:       {type: Boolean, default: false},
        subreddit:  {type: String,  default: ""},
        over_18:    Boolean,
        ackn:       {type: Boolean, default: false}
    });

    schema.index({owner: 1, postId: 1}, {unique:true});
    schema.statics.extractFromModel = function(model, rule) {
        return {
            owner:      rule.owner,
            postId:     model.get('id'),
            title:      model.get('title'),
            url:        model.get('url'),
            over_18:    model.get('over_18'),
            subreddit:  model.get('subreddit')
        };
    };
    return schema;
};
