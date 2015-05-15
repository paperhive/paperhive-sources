'use strict';

var test = 'http://arxiv.org/abs/1208.0264';

//console.log(verifyUrl(test));
var idRegExp = '(\\d+\\.\\d+|.+/\\d+)(v(\\d+))?';
var sources = [
  {
    name: 'arxiv',
    regexp: new RegExp(
      '^(https?://)?(.*\\.)?arxiv.org/(abs|pdf)/(' + idRegExp +
      ')(\\.pdf)?([#\\?].*)?$',
      'i'
    )
  }
];

var verifyUrl = function(url) {
  for (var i = 0; i < sources.length; i++) {
    var result = sources[i].regexp.exec(url);
    if (result) {
      return result;
    }
  }
  return undefined;
};

module.exports = {
  verifyUrl: verifyUrl
};
