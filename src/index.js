var urlPackage = require('url');

module.exports = function paperhiveSources(_options) {
  // sanitize options
  var options = _options || {};
  options = {
    apiUrl: options.apiUrl || 'https://paperhive.org/api',
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
        id: result[1],
      };
      if (result[2]) {
        ret.revision = 'v' + result[2];
      }
      return ret;
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
        id: result[1] + '/' + result[2],
      };
      return a;
    },
  ];

  function parseUrl(url) {
    for (var i = 0; i < urlParser.length; i++) {
      var result = urlParser[i](url);
      if (result) {
        return result;
      }
    }
  }

  function getAccessiblePdfUrl(documentRevision) {
    // TODO actually check if user has access beyond open access
    var userHasAccess = documentRevision.isOpenAccess;
    if (!userHasAccess) {
      throw new Error('You currently have no access to the PDF.');
    }

    var pdfConn = documentRevision.file;

    if (pdfConn.hasCors && urlPackage.parse(pdfConn.url).protocol === 'https') {
      // all good
      return pdfConn.url;
    }

    // No HTTPS/Cors? PaperHive can proxy the document if it's open access.
    if (documentRevision.isOpenAccess) {
      return options.apiUrl + '/proxy?url=' + encodeURIComponent(pdfConn.url);
    }

    throw new Error('The publisher makes the PDF available only through an insecure connection.');
  }

  return {
    parseUrl: parseUrl,
    getAccessiblePdfUrl: getAccessiblePdfUrl,
    hostnames: ['arxiv.org', 'link.springer.com'],
  };
};
