module.exports = function(BB, tokenize) {

var Link = BB.Model.extend({
    getWords:    function(key) {
        return tokenize(this.get(key));
    }
});

return Link;
};
