module.exports = function(mongoose) {
    var schema =  new mongoose.Schema({
        owner:      {type: Number,  default: 1},
        created:    {type: Date,    default: Date.now},
        postId:     {type: String,  default: ''},
        title:      {type: String,  default: "DEFAULT TITLE"},
        url:        {type: String,  default: ""},
        sent:       {type: Boolean, default: false},
        ackn:       {type: Boolean, default: false}
    });

    schema.index({owner: 1, postId: 1}, {unique:true});
    return schema;
};
