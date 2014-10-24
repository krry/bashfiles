function FeatureOptionService_ () {
  // this is a feature constructor
  // 

  this.detailConstructor = function(type){
  	var possibleOptions = {};
  	var obstruction = possibleOptions.obstruction = {};
  	var mount = possibleOptions.mount = {};

  	// TODO: mount pitch? 

  	mount.panelOrientation = {
  		name: 		 'Panel Orientation',
  		options: [{
					value: 'landscape',
					text:  'Landscape'
				},{
					value: 'portrait',
					text:  'Portrait'
			}],
			chosenValue: null
		};

		mount.gutterHeight = {
			name: 'Gutter Height',
			options:  [{
					value: 'one',
					text:  'One Story'
				},{
					value: 'two',
					text:  'Two Story'
				},{
					value: 'more',
					text: 'More Than Two Stories'
			}],
			chosenValue: null
		};

		mount.overallShading = {
			name: 'Overall Shading',
			options: [{
					value: 'heavy',
					text:  'Heavy'
				},{
					value: 'medium',
					text:  'Medium'
				},{
					value: 'little',
					text:  'Little'
				},{
					value: 'none',
					text:  'None'
			}],
			chosenValue: null
		};

		mount.roofType = {
			name: 'Roof Type',
			options: [{
					value: 'composite',
					text:  'Composite'
				},{
					value: 'flat-tile',
					text:  'Flat Tile'
				},{
					value: 'round-tile',
					text:  'Round Tile'
				},{
					value: 'rolled',
					text:  'Rolled Roof'
			}],
			chosenValue: null
		};

  	return possibleOptions[type];
  };


}
angular.module('flannel').service('FeatureOptionService', FeatureOptionService_);  
