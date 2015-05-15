'use strict';
var sources = require('../src/');
var should = require('should');

describe('verify urls', function() {

  it('should verify arXiv source URL', function() {
    var url = 'http://arxiv.org/abs/1208.0264v234';
    var out = sources.verifyUrl(url);
    out.should.eql({
      source: 'arxiv.org',
      id: '1208.0264v234'
    });
  });

});
