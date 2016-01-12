const urlParser = [
  function parseArxiv(url) {
    const idRegExp = '(\\d+\\.\\d+|.+/\\d+)(?:v(\\d+))?';
    const regExp = new RegExp(
      '^(?:https?://)?(?:.*\\.)?arxiv\.org/(?:abs|pdf)/' + idRegExp +
      '(?:\\.pdf)?(?:[#\\?].*)?$',
      'i' // case-insensitive matching
    );
    const result = regExp.exec(url);
    if (!result) return undefined;

    const ret = {
      type: 'arxiv',
      id: result[1],
    };
    if (result[2]) {
      ret.revisionId = 'v' + result[2];
    }
    return ret;
  },
  function parseSpringer(url) {
    const regExp = /^(?:https?:\/\/)?link\.springer\.com\/(?:article\/)?([^\/]*)(?:%2F|\/)([^#\/]*)/i;
    const result = regExp.exec(url);
    if (!result) return undefined;

    return {
      type: 'springer',
      id: result[1] + '/' + result[2],
    };
  },
];

const parseUrl = (url) => {
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
