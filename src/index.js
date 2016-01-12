var urlParser = [
  function parseArxiv(url) {
    var idRegExp = '(\\d+\\.\\d+|.+/\\d+)(?:v(\\d+))?';
    var regExp = new RegExp(
      '^(?:https?://)?(?:.*\\.)?arxiv\.org/(?:abs|pdf)/' + idRegExp +
      '(?:\\.pdf)?(?:[#\\?].*)?$',
      'i' // case-insensitive matching
    );
    var result = regExp.exec(url);
    if (!result) return undefined;

    var ret = {
      type: 'arxiv',
      id: result[1],
    };
    if (result[2]) {
      ret.revisionId = 'v' + result[2];
    }
    return ret;
  },
  function parseSpringer(url) {
    var regExp = /^(?:https?:\/\/)?link\.springer\.com\/(?:article\/)?([^\/]*)(?:%2F|\/)([^#\/]*)/i;
    var result = regExp.exec(url);
    if (!result) return undefined;
    var a = {
      type: 'springer',
      id: result[1] + '/' + result[2],
    };
    return a;
  },
];

var parseUrl = (url) => {
  for (var i = 0; i < urlParser.length; i++) {
    var result = urlParser[i](url);
    if (result) {
      return result;
    }
  }
};

module.exports = {
  parseUrl,
  hostnames: ['arxiv.org', 'link.springer.com'],
};
