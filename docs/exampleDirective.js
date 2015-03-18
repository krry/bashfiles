directives.directive('exampleDirective', ["exampleDependency", exampleDirective_]);

function exampleDirective_ () {
  return {
    priority: 0, // determines the order in which directives are applied to the DOM
    terminal: false, // set to true to make the current priority of directives the last to execute
    scope: false, // set to true to create a new scope for the directive, or pass an object representing the isolate scope which does not inherit from its parent scope
    controller: 'ExampleCtrl', // can be string name or function($scope, $element, $attrs, $transclude){}
    controllerAs: 'example', // must define an isolate scope if used
    require: 'anotherDirective',
    restrict: 'A', // E - element, A - attribute, C - class, M - comment
    type: 'html', // html - <html>, svg - <svg>, math - <math>
    template: '<div></div>' // takes markup for the template
    templateUrl: 'templates/exampleDirective.html', // path to a template file
    transclude: false, // set to true to transclude the content of the directive, set to 'element' to transclude the whole element including lower priority directives
    compile: function () {} // only if no `link` property is defined
    link: function (scope, element, attrs, controller, transcludeFn) {
      // executed after the template has been added to the DOM
      // register DOM listeners
      // `scope` is the same as `$scope` in the controller or the `scope` property on the direction
      // `element` is the element to which the directive is applied
      // `attrs` are the attributes of the element, stored in an object literal
      // `controller` is the controller attached to the element via any directive
      // `transcludeFn` is a function([scope], cloneLinkingFn) {}
    }
  };
}

/* ============================================================================

  ## ISOLATE SCOPE

    * the keys are the property names
    * the values define the bind
      * `@` string bind
      * `=` object bind (two-way)
      * `&` expression bind
      * optionally follow the symbol with a custom attribute name

    e.g. `scope: { propertyName: '@customPropertyName'}`
         `<ng-example custom-property-name="butts">{{property-name}}</ng-example>`

  ## REQUIRE PREFIXES

    * `require: 'anotherDirective'` requires the Ctrl of anotherDirective
    * `require: '?anotherDirective'` optionally adds the Ctrl
    * `require: '^anotherDirective'` requires Ctrl from the element's parents
    * `require: '?^anotherDirective'` optionally adds Ctrl from parents

============================================================================ */
