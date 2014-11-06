Design Principles: 
	- application behavior controlled by directives
	- configure stages & sub-steps with templates
	- services provide tools for registering model events
	- directives should listen for themselves and destroy themselves

## Control Groups:

### Area buttons: 

#### fln-control-area: 
	- this allows us to focus or remove an 
	- ng-repeat for all areas on design

#### fln-area-remove-or-cancel
		[scope.area]
		=====
		if ($scope.focused === scope.area) {
			attr.focused = "true"
		} 
		// listen ( click, Interaction.removeOrCancel(scope.area) )

#### fln-area-select
		[scope.area]
		ng-class="{selected: highlight-area-selected}" 

		listen ( click, Interaction.select(scope.area) )

		set selected true if fln-ol-map selected object changes

### Map Buttons

#### fln-control-pan
	template w/ 4x <button map-pan direction="up">
		[ scope.direction ]
		MapService.moveCenter(scope.direction)

#### fln-control-zoom
	template w/ 2x <button map-zoom>
		[ scope.scalar ]
		MapService.zoom(scope.scalar)


## Button Directives: 

### Area related
#### button fln-area-add
	// move to beginning of draw loop

### Flow related
#### button fln-step-forward
	// step forward, or move to next stage
#### button fln-step-backward
	// step backward, or move to next stage


#### button fln-app-reset
	// save current design, start w/ new designID
	// would be nice to be able to revert to previous design
#### button fln-design-share
	// generate share link if it's not done already
	// copy share link to clipboard
#### button fln-design-save
	// generate return-to-edit link
	// move to "see you later" stage