providers.value('rx_ref',
  // function rx_refProvider () {
  /**
   * @function provider
   * @name rx_ref
   * @param {String|Array...} path
   * @return a Firebase+RXjs stream
   */
  // this.startup = function() {
  //   console.log(arguments)
  // }

  // this.$get = ['FBURL',
  //   function rx_ref_factory (FBURL) {
  //     var root_ref_url = FBURL + 'designs/'
  //     function rx_rf(path) {
  //       console.log(arguments);
  //       return new Firebase(pathRef([root_ref_url].concat(Array.prototype.slice.call(arguments)))).observe();
  //     };
  //   }
  // ]

    function rx_ref_factory (FBURL) {
      var root_ref_url = FBURL + 'designs'
      return function rx_rf(path) {
        console.log(pathRef([root_ref_url].concat(Array.prototype.slice.call(arguments))));
        return new Firebase(pathRef([root_ref_url].concat(Array.prototype.slice.call(arguments)))).observe();
      };
    }

  // }
)

function pathRef(args) {
  for(var i=0; i < args.length; i++) {
    if( typeof(args[i]) === 'object' ) {
      args[i] = pathRef(args[i]);
    }
  }
  return args.join('/');
}
