'use strict';

//console.log(parseUrl(test));
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

var parseUrl = function(url) {
  for (var i = 0; i < sources.length; i++) {
    var result = sources[i].regexp.exec(url);
    if (result) {
      return {
        source: 'arxiv.org',
        id: result[5],
        version: result[7]
      };
    }
  }
  return undefined;
};

module.exports = {
  parseUrl: parseUrl
};
