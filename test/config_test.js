var Config = require("../lib/config");

exports.configTest = {
  defaultTest: function(test) {
    var configObj = new Config("random.json");
    test.equal(configObj.config.type.length, 4);
    test.equal(configObj.config.url, void 0);
    test.done();
  },
  loadLoraxJsonTest: function(test) {
    var configObj = new Config();
    test.equal(configObj.config.url, "https://github.com/adrianlee44/lorax");
    test.done();
  },
  getFunctionTest: function(test) {
    var configObj = new Config();
    test.equal(configObj.get("url"), "https://github.com/adrianlee44/lorax");
    test.done();
  },
  setFunctionTest: function(test) {
    var configObj = new Config();
    configObj.set("issue", "/issues/test/%s");
    test.equal(configObj.get("issue"), "/issues/test/%s");
    test.done();
  },
  customPropertyTest: function(test) {
    var configObj = new Config();
    test.ok(configObj.custom);
    test.done();
  },
  customPropertyFalseTest: function(test) {
    var configObj = new Config("random.json");
    test.equal(configObj.custom, false);
    test.done();
  },
  resetTest: function(test) {
    var configObj = new Config();
    
    test.expect(2);
    
    configObj.set("url", "https://github.com/");
    test.notEqual(configObj.get("url"), "https://github.com/adrianlee44/lorax");
    
    configObj.reset();
    
    test.equal(configObj.get("url"), "https://github.com/adrianlee44/lorax");
    
    test.done();
  }
};
