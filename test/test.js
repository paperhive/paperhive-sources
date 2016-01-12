const sources = require('../src/');
const should = require('should');

describe('parseUrl()', () => {
  it('should parse arXiv URLs', () => {
    sources.parseUrl('http://arxiv.org/abs/1208.0264v4').should.eql({
      type: 'arxiv',
      id: '1208.0264',
      revisionId: 'v4',
    });
    sources.parseUrl('http://arxiv.org/pdf/1208.0264.pdf').should.eql({
      type: 'arxiv',
      id: '1208.0264',
    });
    sources.parseUrl('http://de.arxiv.org/abs/hep-th/0608195v3').should.eql({
      type: 'arxiv',
      id: 'hep-th/0608195',
      revisionId: 'v3',
    });
  });

  it('should parse springer URLs', () => {
    const sll15 = {
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
    const url = 'http://www.google.com/';
    const out = sources.parseUrl(url);
    should(out).not.be.ok;
  });
});
