/**
 * @license PaperHive Chrome Extension v0.0.1
 * (c) 2015 Nico Schlömer <nico@paperhive.org>
 * License: GPL-3
 */
'use strict';

//console.log(parseUrl(test));
var idRegExp = '(\\d+\\.\\d+|.+/\\d+)(?:v(\\d+))?';
var sources = [
  {
    name: 'arxiv',
    regexp: new RegExp(
      '^(?:https?://)?(?:.*\\.)?arxiv.org/(?:abs|pdf)/' + idRegExp +
      '(?:\\.pdf)?(?:[#\\?].*)?$',
      'i' // case-insensitve matching
    )
  }
];

var parseUrl = function(url) {
  for (var i = 0; i < sources.length; i++) {
    var result = sources[i].regexp.exec(url);
    if (result) {
      return {
        source: 'arxiv.org',
        id: result[1],
        version: result[2]
      };
    }
  }
  return undefined;
};

module.exports = {
  parseUrl: parseUrl,
  hostnames: ['arxiv.org']
};
