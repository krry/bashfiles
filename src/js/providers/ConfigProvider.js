providers.provider("ConfigProvider", [ConfigProvider_]);

function ConfigProvider_(config) {
  var settings = {};
  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      settings[key] = config[key];
    }
  }
  return {
    set: function (settings) {
      config = settings;
    },
    $get: function () {
      return settings;
    }
  };
});
