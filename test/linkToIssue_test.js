var lorax = require('../index');
var linkToIssue = lorax.linkToIssue;

exports.linkToIssueTest = {
  tearDown: function(callback) {
    lorax.config.reset();
    callback();
  },
  basicTest: function(test) {
    var output = linkToIssue('123');
    
    test.equal(output, '[#123](https://github.com/adrianlee44/lorax/issues/123)');
    test.done();
  },
  noUrlTest: function(test) {
    lorax.config.set('url', '');
    
    var output = linkToIssue('123');
    test.equal(output, '#123');
    test.done();
  },
  noIssueTemplateTest: function(test) {
    lorax.config.set('issue', '');
    
    var output = linkToIssue('123');
    test.equal(output, '#123');
    test.done();
  },
  noIssueTest: function(test) {
    var output = linkToIssue();
    test.equal(output, '');
    test.done();
  }
};