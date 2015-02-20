/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  SCRIPTS
  supports BUILD task

  lints the scripts with jsHint, outputs to the dev console
  concatenates all our `src/js`, uglifies it and produces
  a minified `all.min.js` and the debuggable `all.js`

  adapted from RealCrowd's directive:
  http://code.realcrowd.com/using-mailguns-email-address-validation-service-with-angularjs/

  which adapts Mailgun's jQuery plugin for Angular:
  http://blog.mailgun.com/free-email-validation-api-for-web-forms/

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

directives.directive('mailgunValidate', ["Mailgun", flnMailgun_]);

function flnMailgun_ (Mailgun) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attributes, modelController) {
      var options,
          error_message,
          baseSuccessCallback,
          baseErrorCallback,
          baseInProgressCallback,
          successWrapper,
          errorWrapper,
          inProgressWrapper,
          clearWhenBlankValidator;

      if (!$.fn.mailgun_validator) {
        console.log('jQuery mailgun_validator plugin required');
      }

      options = Mailgun.getOptions();

      options = options || {};

      baseSuccessCallback = options.success;
      baseErrorCallback = options.error;
      baseInProgressCallback = options.in_progress;

      scope.replaceEmailWithSuggestion = replaceEmailWithSuggestion;

      function replaceEmailWithSuggestion (suggestion) {
        console.log("trying to replace with suggestion", suggestion);
        element.prop('value', suggestion);
      }

      successWrapper = function(data) {
        modelController.$setValidity('MailgunInProgress', true);
        modelController.$setValidity('MailgunFinished', true);
        modelController.$setValidity('MailgunEmailValid', (data && data.is_valid));
        console.log("mailgun data returned: ", data);
        // expose the returned suggestion on the scope
        if (!data.is_valid){
          scope.did_you_mean = data.did_you_mean;
        }
        // clear mailgun status (used for errors)
        Mailgun.mailgunStatus = '';
        console.log("not scope phase is:", !scope.$$phase);
        if (!scope.$$phase) scope.$apply();

        if (baseSuccessCallback)
          baseSuccessCallback(data);
      }

      errorWrapper = function(error_message) {
        modelController.$setValidity('MailgunInProgress', true);
        modelController.$setValidity('MailgunFinished', true);
        modelController.$setValidity('MailgunEmailValid', false);
        // set mailgun status (used for errors)
        Mailgun.mailgunStatus = error_message;
        if (!scope.$$phase) scope.$apply();

        if (baseErrorCallback)
          baseErrorCallback(error_message);
      }

      inProgressWrapper = function() {
        // clear when checking
        modelController.$setValidity('MailgunEmailValid', true);
        modelController.$setValidity('MailgunInProgress', false);
        if (!scope.$$phase) scope.$apply();

        if (baseInProgressCallback)
          baseInProgressCallback(error_message);
      }

      // wrap all callbacks so the validator can respond, but user can still use the callbacks if needed
      options.success = successWrapper;
      options.error = errorWrapper;
      options.in_progress = inProgressWrapper;

      $(element).mailgun_validator(options);

      clearWhenBlankValidator = function (value) {
          if (!value) {
            modelController.$setValidity('MailgunEmailValid', true);

            // clear mailgun status (used for errors)
            Mailgun.mailgunStatus = '';
          }

          return value;
      };

      modelController.$formatters.push(clearWhenBlankValidator);
      modelController.$parsers.unshift(clearWhenBlankValidator);

      // if element is initialized with a value, force validation
      if (element.val()) {
        element.focusout();
      }
    }
  };
}
