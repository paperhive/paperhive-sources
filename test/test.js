var sources = require('../src/');
var should = require('should');

describe('parseUrl()', () => {
  it('should parse arXiv URLs', () => {
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

  it('should parse springer URLs', () => {
    var sll15 = {
      type: 'springer',
      id: '10.1007/s10714-015-1876-6',
    };
    [
      'http://link.springer.com/article/10.1007%2Fs10714-015-1876-6',
      'http://link.springer.com/article/10.1007/s10714-015-1876-6',
      'http://link.springer.com/10.1007%2Fs10714-015-1876-6',
      'http://link.springer.com/10.1007/s10714-015-1876-6',
    ].forEach((url) => {
      sources.parseUrl(url).should.eql(sll15);
    });
  });

  it('should fail for some random URLs', () => {
    var url = 'http://www.google.com/';
    var out = sources.parseUrl(url);
    should(out).not.be.ok;
  });
});

describe('getPdfUrl()', () => {
  it('should get arXiv URLs', () => {
    const doc = {
      remote: {
        type: 'arxiv',
        id: '1405.0001',
        revision: 'v1',
      }};
    const out = sources.getPdfUrl(doc);
    out.should.have.property('url', 'http://arxiv.org/pdf/1405.0001v1.pdf');
    out.should.have.property('hasCors', false);
  });

  it('should get Nature URLs', () => {
    const doc = {
      remote: {
        type: 'nature',
        id: '10.1038/ncomms8575',
        revision: '10.1038/ncomms8575',
      },
      doi: '10.1038/ncomms8575',
    };
    const out = sources.getPdfUrl(doc);
    out.should.have.property('url', 'http://www.nature.com/articles/ncomms8575.pdf');
    out.should.have.property('hasCors', false);
  });

  it('should get PLOS URLs', () => {
    const doc = {
      remote: {
        type: 'plos',
        id: '10.1371/journal.pone.0143047',
        revision: '10.1371/journal.pone.0143047',
      },
      doi: '10.1371/journal.pone.0143047',
    };
    const out = sources.getPdfUrl(doc);
    out.should.have.property('url', 'http://www.plosone.org/article/fetchObject.action?uri=info:doi/10.1371/journal.pone.0143047&representation=PDF');
    out.should.have.property('hasCors', false);
  });
});
