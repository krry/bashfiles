function HomeCtrl_($scope, $state, OlService, MapService) {
	var map = MapService.getOmap();
	if (map !== null) {
		OlService.clearAllMapFeatures(map);
	}
}
controllers.controller('HomeCtrl', HomeCtrl_);
