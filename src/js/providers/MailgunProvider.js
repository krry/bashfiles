/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Mailgun Provider

  provides an 


=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Mailgun', [ MailgunProvider_ ]);

function MailgunProvider_ () {
  var configuredOptions = {};

  this.configure = function (options) {
    configuredOptions = options;
  };

  this.$get = function () {
    return {
      getOptions: function () {
        return configuredOptions;
      },
      mailgunStatus: ''
    };
  }
}
