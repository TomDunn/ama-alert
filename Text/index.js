var tokenize = function(text) {
    return text.toLowerCase().replace(/\W/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
};

var sentence_tokenize = function(text) {
    return text.toLowerCase()
        .replace(/\.\s+/g, ' END ')
        .replace(/\W/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ');
};

module.exports.tokenize = tokenize;
module.exports.sentence_tokenize = sentence_tokenize;
