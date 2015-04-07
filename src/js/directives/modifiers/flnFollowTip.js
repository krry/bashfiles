// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//
//  flnFollowTip
//
//  a directive that attaches a hover-activated followtip to
//  the element to which it is applied
//
//  the followtip follows the mouse as it moves within
//  the element
//
//  e.g., <div fln-follow-tip
//             tipText="following a mouse"
//             position="right"></div>
//
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

directives.directive("flnFollowTip", [flnFollowTip_]);

function flnFollowTip_ () {
  return {
    restrict: "CA",
    transclude: true,
    // replace: true,
    scope: {
      position: "@position",
      tip: "@tipText",
    },
    templateUrl: "templates/directives/modifiers/flnFollowTip.html",
    link: function FollowTipLink(scope, el, attrs) {
      var tip,
          offsetX,
          offsetY;

      tip = $(el[0]).find('span');
      console.log("parent div starts at top:", $(el).offset().top, "and left:", $(el).offset().left);
      offsetX = tip.offset().left + 20;
      offsetY = tip.offset().top;
      console.log(offsetX);

      $(el).addClass('followtipped');

      // only show the followtip when the mouse is over the proper div
      $(el).on('mouseover', function(){
        tip.css('visibility', 'visible');
      });

      $(el).on('mouseout', function(){
        tip.css('visibility', 'hidden');
      });

      // TODO: enable the mouse following tip to be positioned on other sides of the cursor
      // TODO: apply position to the follow-tip with a function that changes offsetX and offsetY
      // var position = attrs.position;
      // $(tip).addClass(attrs.position);


      window.onmousemove = function (e) {
          var x = e.clientX,
              y = e.clientY;
          tip.css("left", (x - offsetX - 30));
          tip.css("top", (y - offsetY - 40));
      };
    }
  };
}
