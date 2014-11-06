ServicesNeeded.md

## ButtonService
ButtonService.listen (element, listner, callback) // this may have to work differently
	element.$on(listener, cb)
	return ???
## DesignService
DesignService.select -> area || segment || point
	if area
		set $scope.focusedArea = area
	else if segment or point
		set $scope.focusedArea.highPoint = segment || point
	finally
		return { area: $scope.focusedArea, highPoint.$scope.focusedArea.highPoint }

DesignService.removeOrCancel -> area
	if area === focusedArea
		remove area
	else if area !== focusedArea
		cancel drawing

## MapControlService
MapControlService.panStep = distance to pan for scalar
MapControlService.moveCenter -> direction || newCenter 
	if (arg === string) 
		moveCenter to mapCenter + MapControlService.panStep[arg]
	else if (arg === object) 
		make sure object is a mapCenter
		map.setCenter(arg)
MapControlService.zoom -> scalar || level
	map.setZoom( map.currentZoom + scalar )

## InteractionService
InteractionService.enable  -> [interaction]
	if typeof args !== array
		arg = [arg]
	arg.forEach( map.addInteraction(item) )

InteractionService.disable -> [interaction] 
	if typeof args !== array
		arg = [arg]
	arg.forEach( map.removeInteraction(item) )

InteractionService.clearAll ->
	var interactions = map.getInteractions()
	var defaults     = InteractionService.defaults
	InteractionService.disable(interactions)
	InteractionService.enable(defaults)
	return map.getInteractions()

## OverlayService
OverlayService.detailArea -> area
	// unless area.slope === flat, show detail overlay
OverlayService.toggleCrosshair -> 
	// show/hide crosshair overlay

## StageService
	StageService.getStage
	  // return stage based on string or id#
	( done ) StageService.nextStage
		$state.go(stage.destination)

	StageService.nextStep
		step++

	.previousStep
		step--

	StageService.stages 
		// an array of stages like this: 

	{
		name: "stage name",
		urlBase: "/stage",
		views: [
			{"viewName": "partial.html"},
			{"viewName": "partial.html"},
			{"viewName": "partial.html"}, 
		],
		steps: [
			{ name: "step name",
				views: [
					{"viewName": "partial.html"},
					{"viewName": "partial.html"},
				],
			},
			{ name: "step2",
				views: [
					{"viewName": "partial.html"},
					{"viewName": "partial.html"},
					{"viewName": "partial.html"},
				],
			},

		], 

	}






	