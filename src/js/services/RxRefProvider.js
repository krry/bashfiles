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
  }

  this.$get = ['FBURL',
    function rx_rf(FBURL) {
      console.log('args',arguments);
      return new Firebase('https://scty.firebaseio.com/designs/1234/').observe('value');
    } ]
  }
)
