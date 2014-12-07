// http://newtriks.com/2013/04/26/how-to-test-an-angularjs-directive/

describe('Directive: flnControlPan', function() {

  beforeEach(module('flannel.directives'));

  var element, scope;

  // beforeEach(module('views/templates/albums.html')); // See the note in the URL at top about compiling html to js.

  beforeEach(module("flannel.directives", function ($provide) {
      mockMapService = {
          getOmap: function() {
            return {
              getSize: function() {return 1;},
              getView: function() {return {};}
            };
          }
      };
      $provide.value("MapService", mockMapService);
  }));


  // beforeEach(inject(function($rootScope, $compile) {
  //   element = angular.element('<fln-control-pan></fln-control-pan>');

  //   scope = $rootScope.$new();

  //   $compile(element)(scope);
  //   scope.$digest();
  // }));

  // it("should insert 4 buttons", function() {
  //   var list = element.find('button');
  //   expect(list.length).toBe(4);
  // });
});
