var mongoose    = require('mongoose');
mongoose.connect('mongodb://localhost/ama-catch');

var db          = mongoose.connection;
var ruleSchema  = require('./schemas/rule')(mongoose);
var notifSchema = require('./schemas/notification')(mongoose);
var ruleModel   = db.model('Rule', ruleSchema);

var Models      = {
    Rule:           db.model('Rule', ruleSchema),
    Notification:   db.model('Notification', notifSchema)
};

module.exports = {
    db:         db,
    Models:     Models,
    mongoose:   mongoose
};
