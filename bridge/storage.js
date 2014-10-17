var JSONStorage = new (function() {
  var self = this;

  self.BASE_KEY_NAME = 'blockly_bridge_';
  self.store = window.localStorage;
  self.set = function(key, value) {
    value = JSON.stringify(value);
    self.store[self.BASE_KEY_NAME + key] = value;
  };
  self.get = function(key) {
    try {
      return JSON.parse(self.store[self.BASE_KEY_NAME + key]);
    } catch(e) {
      return null;
    }
  };
  self.remove = function(key) {
    delete self.store[self.BASE_KEY_NAME + key];
  };
  self.keys = function() {
    return Object.keys(self.store).filter(function(name) {
      return (name.indexOf(self.BASE_KEY_NAME) == 0);
    }).map(function(name) {
      return name.slice(self.BASE_KEY_NAME.length);
    });
  };
  self.clear = function() {
    self.keys().forEach(self.remove);
  };
})();
