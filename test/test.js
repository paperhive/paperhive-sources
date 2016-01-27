var sources = require('../src/')();
var should = require('should');

describe('parseUrl()', function () {
  it('should parse arXiv URL', function () {
    sources.parseUrl('http://arxiv.org/abs/1208.0264v4').should.eql({
      type: 'arxiv',
      id: '1208.0264',
      revision: 'v4',
    });
    sources.parseUrl('http://arxiv.org/pdf/1208.0264.pdf').should.eql({
      type: 'arxiv',
      id: '1208.0264',
    });
    sources.parseUrl('http://de.arxiv.org/abs/hep-th/0608195v3').should.eql({
      type: 'arxiv',
      id: 'hep-th/0608195',
      revision: 'v3',
    });
  });

  it('should parse springer URL', function () {
    var sll15 = {
      type: 'springer',
      id: '10.1007/s10714-015-1876-6',
    };
    [
      'http://link.springer.com/article/10.1007%2Fs10714-015-1876-6',
      'http://link.springer.com/article/10.1007/s10714-015-1876-6',
      'http://link.springer.com/10.1007%2Fs10714-015-1876-6',
      'http://link.springer.com/10.1007/s10714-015-1876-6',
    ].forEach(function (url) {
      sources.parseUrl(url).should.eql(sll15);
    });
  });

  it('should fail for some random URL', function () {
    var url = 'http://www.google.com/';
    var out = sources.parseUrl(url);
    should(out).not.be.ok;
  });
});

describe('getPdfConnection()', function () {
  it('should get arXiv URL', function () {
    var doc = {
      remote: {
        type: 'arxiv',
        id: '1405.0001',
        revision: 'v1',
      }};
    var out = sources.getPdfConnection(doc);
    out.should.have.property('url', 'http://arxiv.org/pdf/1405.0001v1.pdf');
    out.should.have.property('hasCors', false);
  });

  it('should get Nature URL', function () {
    var doc = {
      remote: {
        type: 'nature',
        id: '10.1038/ncomms8575',
        revision: '10.1038/ncomms8575',
      },
      doi: '10.1038/ncomms8575',
    };
    var out = sources.getPdfConnection(doc);
    out.should.have.property('url', 'http://www.nature.com/articles/ncomms8575.pdf');
    out.should.have.property('hasCors', false);
  });

  it('should get PLOS URL', function () {
    var doc = {
      remote: {
        type: 'plos',
        id: '10.1371/journal.pone.0143047',
        revision: '10.1371/journal.pone.0143047',
      },
      doi: '10.1371/journal.pone.0143047',
    };
    var out = sources.getPdfConnection(doc);
    out.should.have.property('url', 'http://www.plosone.org/article/fetchObject.action?uri=info:doi/10.1371/journal.pone.0143047&representation=PDF');
    out.should.have.property('hasCors', false);
  });

  it('should get Springer URL', function () {
    var doc = {
      remote: {
        type: 'springer',
        id: '10.1186/s40535-015-0013-7',
        revision: '10.1186/s40535-015-0013-7',
      },
      doi: '10.1186/s40535-015-0013-7',
    };
    var out = sources.getPdfConnection(doc);
    out.should.have.property('url', 'http://link.springer.com/content/pdf/10.1186%2Fs40535-015-0013-7.pdf');
    out.should.have.property('hasCors', false);
  });

  it('should get IOP URL', function () {
    var doc = {
      remote: {},
      publisher: 'IOP Publishing',
      doi: '10.1088/1367-2630/18/1/011001',
    };
    var out = sources.getPdfConnection(doc);
    out.should.have.property('url', 'https://iopscience.iop.org/article/10.1088/1367-2630/18/1/011001/pdf');
    out.should.have.property('hasCors', false);
  });

  it('should get Optical Society URL', function () {
    var doc = {
      remote: {},
      publisher: 'The Optical Society',
      doi: 'DOI',
      journalName: 'Journal of Test',
      volume: '1',
      issue: '5',
      pageStart: '544',
    };
    var out = sources.getPdfConnection(doc);
    out.should.have.property('url', 'https://www.osapublishing.org/jt/viewmedia.cfm?uri=jt-1-5-544&seq=0');
    out.should.have.property('hasCors', false);
  });

  it('should get ACM URL', function () {
    var doc = {
      remote: {},
      publisher: 'Association for Computing Machinery (ACM)',
      doi: '10.1145/2831270',
    };
    var out = sources.getPdfConnection(doc);
    out.should.have.property('url', 'https://dl.acm.org/ft_gateway.cfm?id=1145/2831270');
    out.should.have.property('hasCors', false);
  });

  it('should get SIAM URL', function () {
    var doc = {
      remote: {},
      publisher: 'Society for Industrial & Applied Mathematics (SIAM)',
      doi: '10.1137/140992564',
    };
    var out = sources.getPdfConnection(doc);
    out.should.have.property('url', 'http://epubs.siam.org/doi/pdf/10.1137/140992564');
    out.should.have.property('hasCors', false);
  });

  it('should get OUP URL', function () {
    var doc = {
      remote: {},
      publisher: 'Oxford University Press (OUP)',
      journalName: 'Journal of Experimental Botany',
      volume: '67',
      issue: '2',
      pageStart: '449',
    };
    var out = sources.getPdfConnection(doc);
    out.should.have.property('url', 'http://jxb.oxfordjournals.org/content/67/2/449.full.pdf');
    out.should.have.property('hasCors', false);
  });
});

describe('getPdfConnection()', function () {
  it('should get accessible arXiv URL', function () {
    var doc = {
      remote: {
        type: 'arxiv',
        id: '1405.0001',
        revision: 'v1',
      },
      openAccess: true,
    };
    var out = sources.getAccessiblePdfUrl(doc);
    out.should.be.equal(
      'https://paperhive.org/api/proxy?url=' +
      encodeURIComponent('http://arxiv.org/pdf/1405.0001v1.pdf')
    );
  });
});
