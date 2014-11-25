'use strict';

angular.module('autoSizeInput', [])
  .directive('autoSizeInput', function() {
    return {
      replace: true,
      scope: {
        value: '=inputValue'
      },  
      templateUrl: 'templates/directives/autoSizeInput.html',
      link: function(scope, element, attrs) {
        var elInput = element.find('input');
        var elSpan = element.find('span');
        elSpan.html(elInput.val());

        scope.$watch('value', function(value) {
          if(value) {
            elSpan.html(elInput.val());
            elInput.css('width', (elSpan[0].offsetWidth + 10) + 'px');
          }
        });
      }
    };
  });
