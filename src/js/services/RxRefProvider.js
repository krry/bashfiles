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
    // function rx_ref_factory (FBURL) {
      function rx_rf(FBURL) {
        console.log('args',arguments);
        return new Firebase('https://scty.firebaseio.com/designs/1234/').observe('value');
      }
    // }
  ]

    // function rx_ref_factory (FBURL) {
    //   var root_ref_url = FBURL + 'designs'
    //   return function rx_rf(path) {
    //     console.log(pathRef([root_ref_url].concat(Array.prototype.slice.call(arguments))));
    //     return new Firebase(pathRef([root_ref_url].concat(Array.prototype.slice.call(arguments)))).observe();
    //   };
    // }

  }
)

function pathRef(args) {
  for(var i=0; i < args.length; i++) {
    if( typeof(args[i]) === 'object' ) {
      args[i] = pathRef(args[i]);
    }
  }
  return args.join('/');
}
