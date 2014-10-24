function ObstructionService_ () {
  // this is an Obstruction constructor
  // 

  this.obstructionOptions = [{
		propertyName: "Radius",
		propertyValue: "radius",
		options: [{value: "fixme", text: "fixme"}]
	},{
		propertyName: "Height",
		propertyValue: "height",
		options: [{value: "fixme", text: "fixme to numeric input"}]
	},{
		propertyName: "obstacleId",
		propertyValue: "O#",
		options: [{value: "fixme", text: "fixme"}]
	}];


}
angular.module('edliter').service('ObstructionService', ObstructionService_);  
