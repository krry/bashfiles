# creating streams for stuff

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
  agent_details: [],
  home: [],

}

## stream it brah
create a stream from the app_sync ref
```
  var _ref = new firebaseRef(['designs', design_id], 'home')
```

// firebase events
```
  _ref.observe('child_added')
  .subscribe(function (change) {
    
  })

```
