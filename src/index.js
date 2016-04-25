module.exports = function paperhiveSources(_options) {
  // sanitize options
  var options = _options || {};
  options = {
    apiUrl: options.apiUrl || 'https://paperhive.org/api'
  };

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
        id: result[1]
      };
      if (result[2]) {
        ret.revision = 'v' + result[2];
      }
      return ret;
    },
    function parseOapen(url) {
      var result =
        /^(?:https?:\/\/)?(?:www\.)?oapen\.org\/search\?identifier=(\d*)$/
        .exec(url);
      if (!result) return undefined;
      return {type: 'oapen', id: result[1]};
    },
    function parseSpringer(url) {
      var regExp = new RegExp(
        '^(?:https?://)?link\.springer\.com/' +
        '(?:article/)?([^/]*)(?:%2F|/)([^#/]*)',
        'i'
      );
      var result = regExp.exec(url);
      if (!result) return undefined;
      var a = {
        type: 'springer',
        id: result[1] + '/' + result[2]
      };
      return a;
    }
  ];

  function parseUrl(url) {
    for (var i = 0; i < urlParser.length; i++) {
      var result = urlParser[i](url);
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  return {
    parseUrl: parseUrl,
    hostnames: ['arxiv.org', 'link.springer.com']
  };
};
