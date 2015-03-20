providers.provider('rx_ref',
  function rx_refProvider () {
  /**
   * @provider rx_ref provider, gives us access to the design around the way
   * @name rx_ref
   * @param {String|Array...} path
   * @return a Firebase+RXjs stream
   */

  var existing_user = null;

  this.existing_user = function(user_id) {
    existing_user = user_id;
  };

  this.$get = ['FIREBASE_URL',
    function rx_rf(FIREBASE_URL) {
      console.log('args',arguments);
      return new Firebase(FIREBASE_URL + 'designs/1234/').observe('value');
    } ];
  }
);
