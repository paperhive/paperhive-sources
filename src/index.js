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

  function getAbbreviation(name) {
    // With some publishers, the URL to the PDFs will contain an abbreviation of
    // the journal name, for example:
    //
    // Optics Letters => ol
    // Journal of Lightwave Technology => jlt
    // Physical Review D => prd
    // Reviews of Modern Physics => rmp
    //
    // etc. The pattern seems to be: First letter of all words, except filling
    // words
    // This method returns just that.
    //
    // The Oxford journals replace "Experimental" by "x" in the abbreviation.

    // Kick out filling words
    var cleanName = name.
      replace('of ', '').
      replace('Of ', '').
      replace('the ', '').
      replace('The ', '').
      replace('Experimental ', 'Xperimental ');
    var matches = cleanName.match(/\b(\w)/g);
    return matches.join('').toLowerCase();
  }

  // Generate the URL for a PDF, given a bunch of meta data for an article
  // (revision).
  function getPdfConnection(documentRevision) {
    if (documentRevision.remote.type === 'arxiv') {
      return {
        url: 'http://arxiv.org/pdf/' +
          documentRevision.remote.id +
          documentRevision.remote.revision + '.pdf',
        hasCors: false,
      };
    } else if (documentRevision.remote.type === 'nature') {
      // See <http://www.nature.com/articles/npjcompumats20151> for reference.
      var strippedDoi = documentRevision.doi.
        replace(/[^\/]*\//, ''). // remove first part
        replace(/\./g, ''); // remove `.`
      // No HTTPS, no CORS. Nature notified on Jan 27, 2016.
      return {
        url: 'http://www.nature.com/articles/' + strippedDoi + '.pdf',
        hasCors: false,
      };
    } else if (documentRevision.remote.type === 'plos') {
      // No HTTPS, no CORS. PLOS notified on Jan 27, 2016.
      return {
        url: 'http://www.plosone.org/article/fetchObject.action?uri=info:doi/' +
          documentRevision.doi +
          '&representation=PDF',
        hasCors: false,
      };
    } else if (documentRevision.remote.type === 'springer') {
      return {
        // No HTTPS, no CORS. Springer notified on Jan 27, 2016.
        url: 'http://link.springer.com/content/pdf/' +
        encodeURIComponent(documentRevision.doi) + '.pdf',
        hasCors: false,
      };
    } else if (documentRevision.publisher === 'IOP Publishing') {
      // encodeURIComponent(revision.doi)?
      //
      // With HTTPS, but no CORS. Contacted IOP on Jan 27, 2016.
      return {
        url: 'https://iopscience.iop.org/article/' + documentRevision.doi + '/pdf',
        hasCors: false,
      };
      /*
      // Yikes! All APS PDFs are protected by a captcha,
      // ```
      // Verification Required
      // Please click on the image of Albert Einstein below.
      // ```
      // We regret having to add this extra step for our subscribers, but have
      // found it necessary due to systematic automated downloading of our content
      // (in violation of our Terms and Conditions).
      } else if (revision.publisher === 'American Physical Society (APS)') {
      return 'https://journals.aps.org/' + getAbbreviation(revision.journalName) + '/pdf/' + revision.doi;
      }
      */
    } else if (documentRevision.publisher === 'The Optical Society') {
      var abb = getAbbreviation(documentRevision.journalName);
      return {
        url: 'https://www.osapublishing.org/' + abb + '/viewmedia.cfm?uri=' +
          abb + '-' + documentRevision.volume + '-' +
          documentRevision.issue + '-' + documentRevision.pageStart +
          '&seq=0',
        hasCors: false,
      };
    } else if (documentRevision.publisher === 'Association for Computing Machinery (ACM)') {
      // With ACM, the last part of a DOI serves as identifier, e.g.,
      // DOI: 10.1145/2746539.2746608
      // ID: 2746608
      var doiLastPart = documentRevision.doi.split('.').pop();
      return {
        url: 'https://dl.acm.org/ft_gateway.cfm?id=' + doiLastPart,
        hasCors: false,
      };
    } else if (documentRevision.publisher ===
        'Society for Industrial & Applied Mathematics (SIAM)') {
      return {
        url: 'http://epubs.siam.org/doi/pdf/' + documentRevision.doi,
        hasCors: false,
      };
    } else if (documentRevision.publisher === 'Oxford University Press (OUP)') {
      return {
        url: 'http://' + getAbbreviation(documentRevision.journalName) +
          '.oxfordjournals.org/content/' +
          documentRevision.volume + '/' + documentRevision.issue +
          '/' + documentRevision.pageStart + '.full.pdf',
        hasCors: false,
      };
    }
    throw new Error('Unable to retrieve remote PDF URL.');
  }

  function getAccessiblePdfUrl(documentRevision) {
    // TODO actually check if user has access beyond open access
    var userHasAccess = documentRevision.isOpenAccess;
    if (!userHasAccess) {
      throw new Error('You currently have no access to the PDF.');
    }

    var pdfConn = getPdfConnection(documentRevision);

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
    getPdfConnection: getPdfConnection,
    getAccessiblePdfUrl: getAccessiblePdfUrl,
    hostnames: ['arxiv.org', 'link.springer.com'],
  };
};
