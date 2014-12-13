var lorax = require('../index');
var linkToCommit = lorax.linkToCommit;

exports.linkToCommitTest = {
  tearDown: function(callback) {
    lorax.config.reset();
    callback();
  },
  basicTest: function(test) {
    var output = linkToCommit('1a91039');
    
    test.equal(output, '[1a91039](https://github.com/adrianlee44/lorax/commit/1a91039)');
    test.done();
  },
  noUrlTest: function(test) {
    lorax.config.set('url', '');
    var output = linkToCommit('1a91031a9849');
    
    test.equal(output, '1a91031a');
    test.done();
  },
  noCommitTemplateTest: function(test) {
    lorax.config.set('commit', '');
    
    var output = linkToCommit('1a91031a9849');
    test.equal(output, '1a91031a');
    test.done();
  },
  noCommitTest: function(test) {
    var output = linkToCommit();
    test.equal(output, '');
    test.done();
  }
};