// directives.directive('flnHeaddress', ["Clientstream", flnHeaddress_]);

// function flnHeaddress_ (Client) {
//   return {
//     restrict: "A",
//     scope: {
//       address: "=address",
//     },
//     controller: "HeaddressCtrl",
//     controllerAs: "headdress",
//     templateUrl: "templates/directives/flnHeaddress.html",
//     link: function HeaddressLink (scope, el, attrs) {
//       Client.listen('valid address', function (data) {
//         scope.address = data;
//         console.log('valid address in header:', scope.address);
//         $scope.$apply();
//       });
//     }
//   };
// }
