module.exports = function(app, Models, tokenize) {

    app.get('/', function(req,res) {
        res.redirect('/rule');
    });

    app.get('/rule', function(req,res) {
        Models.Rule.find(function(err, models) {
            res.render('page-layout', {models: models});
        });
    });

    app.get('/rule/:ruleId', function(req,res) {
        Models.Rule.findOne({_id:req.params.ruleId}, function(err,model) {
            res.render('rule/edit', {model: model});
        });
    });

    function parseRuleBody(req) {
        return {
            name:     req.body.name,
            allOf:    tokenize(req.body.allOf),
            oneOf:    tokenize(req.body.oneOf),
            noneOf:   tokenize(req.body.noneOf),
            minScore: Number(req.body.minScore)
        };
    };

    app.post('/rule', function(req,res) {
        var rule = parseRuleBody(req);
        Models.Rule.create(rule, function(err) {
            if (err)
                console.log ('error' + err.toString());
            res.redirect('/');
        });
    });

    app.put('/rule/:ruleId', function(req,res) {
        var rule    = parseRuleBody(req);
        rule.edited = Date.now();

        Models.Rule.update({_id:req.params.ruleId}, rule, function(err, affected) {
            if (err) console.log(err);

            res.redirect('/');
        });
    });

    app.delete('/rule/:ruleId', function(req,res) {
        Models.Rule.find({_id:req.params.ruleId}).remove();
        res.redirect('/');
    });

    app.get('/notification', function(req,res) {
        Models.Notification.find({ackn: false}).sort({created:-1}).exec(function(err,models) {
            res.render('notifications', {models: models});
        });
    });

    app.put('/notification/:notifId', function(req,res) {
        Models.Notification.update({_id:req.params.notifId}, {ackn: true}, {multi:false}, function(err,n) {
            res.redirect('/notification');
        });
    });

    app.delete('/notification/:notifId', function(req,res) {
        Models.Notification.find({_id:req.params.notifId}).remove();
        res.redirect('/notification');
    });
};
