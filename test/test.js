var sources = require('../src/')();
var should = require('should');

describe('parseUrl()', function () {
  it('should parse arXiv URL', function () {
    sources.parseUrl('http://arxiv.org/abs/1208.0264v4').should.eql({
      type: 'arxiv',
      id: '1208.0264',
      revision: 'v4'
    });
    sources.parseUrl('http://arxiv.org/pdf/1208.0264.pdf').should.eql({
      type: 'arxiv',
      id: '1208.0264'
    });
    sources.parseUrl('http://de.arxiv.org/abs/hep-th/0608195v3').should.eql({
      type: 'arxiv',
      id: 'hep-th/0608195',
      revision: 'v3'
    });
  });

  it('should parse oapen URLs', function () {
    var oapen = {type: 'oapen', id: '605035'};
    [
      'http://oapen.org/search?identifier=605035',
      'https://oapen.org/search?identifier=605035',
      'http://www.oapen.org/search?identifier=605035',
      'https://www.oapen.org/search?identifier=605035'
    ].forEach(function (url) {
      sources.parseUrl(url).should.eql(oapen);
    });
  });

  it('should parse springer URL', function () {
    var sll15 = {
      type: 'springer',
      id: '10.1007/s10714-015-1876-6'
    };
    [
      'http://link.springer.com/article/10.1007%2Fs10714-015-1876-6',
      'http://link.springer.com/article/10.1007/s10714-015-1876-6',
      'http://link.springer.com/10.1007%2Fs10714-015-1876-6',
      'http://link.springer.com/10.1007/s10714-015-1876-6'
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
