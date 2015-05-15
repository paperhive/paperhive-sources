'use strict';
var sources = require('../src/');
var should = require('should');

describe('verfiy urls', function() {

  it('should verfiry arxiv source URL', function() {
    var url = 'http://arxiv.org/abs/1208.0264';
    var out = sources.verifyUrl(url);
    out.should.equal('wurstwasser');
  });

});
