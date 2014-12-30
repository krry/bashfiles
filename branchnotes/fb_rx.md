
#  bootstrapping  #
// butts
var ui_lock,
    ui_lock,

// what tools you need

  rcv_update_callback, 
    accept message string from firebase message receive event
    do not run while "lock" (may queue messages?)
    turn on lock mode
    emit('rcv', msg )
    unlock

  

// which streams do you need?
  'send_ui'
  'rcv_upt'

// 









maek a new value - template 
use TEMPLATE in 
  stage 
  templateconfig
















# useful later #
subscribe to form changes:
https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/events.md


stream (ref) -> 
  this.client_change
    ref.update(msg)
  this.server_change
    ref.observe('value')




streams/
  session/
    client
    server
  home_form/
    zipsearch
    geocode
    mapcenter
  design/
    area(s)


      session_object_stream

        client_stream: 
        - client_state_up
        - client_state_dn

        server_stream: 
        - server_state_up
        - server_state_dn




# masterplan #

done - create a ref provider that runs at startup

done - return partials multidimensional array

session service
  get
    new -> 
      {0,0}
    existing (auth) ->
      state obj


design service
  get a design object

  set the unique to a $scope object


firebase

    state
      step_change
      stage_change

    home/form
      address, etc

    designs: 
      areas
        add
        remove
        change

    



# creating streams for stuff

## what streams do i need?

-state
  scty.
-area
-user
-agent

StateStreamService

var requestStream = Rx.Observable.just('https://api.github.com/users');

var responseStream = requestStream
  .flatMap(function(requestUrl) {
    return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
  });

responseStream.subscribe(function(response) {
  // render `response` to the DOM however you wish
});


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



