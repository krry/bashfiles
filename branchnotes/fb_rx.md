
# masterplan #

done - create a ref provider that runs at startup

make that ref provider give us a unique design
 - later, we'll make it give us a correct design

set the unique to a $scope object

... 







# creating streams for stuff

## what streams do i need?

firebase

  state
    step_change
    stage_change

  home/form
    address, etc


  areas
    add
    remove
    change


## app_sync provider

instead of loading the new design in home.js, create a provider. 

the provider should return a function that accepts the cookie data and creates a app_sync_stream from it. 

for a new design, create a new user.
  create a home
  create a state
  attach relevant ids to the design

for an existing user, get their design
  get the relevant home/state/design details

return {
  design_details: refToStream(design_ref),
  home_details:   refToStream(home_ref),
  state_details:  refToStream(state_ref),
}

## stream it
create a stream from the app_sync ref
```
  var _base_ref = new firebaseRef(['designs', design_id]) || new firebaseRef(['designs', design_id]).push()
```

### wkt
```
  _ref.observe('value')
  })
```

### state
```
  
```

## merge the streams
```
var app_sync_stream = Rx.Observable.merge(
  state_stream,
)
```



