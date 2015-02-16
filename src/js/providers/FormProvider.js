/* ================================
  FormProvider

  structures the user flow

  form data structure, e.g.:

  forms: {
    <form_id>: {
      state: {
        stage: 0,
        step:  0,
      },
      event_log:  [{event},{event},{event},...],
      prospect:   "prospect_id",
      design:     "design_id",
      home: {
        address: "123 Example Dr",
        city: "Instanceville",
        state: "FB",
        zip: "54321",
      },
    }
  }

  TODO:
    make a private history function that keeps a record of what you've done

================================ */

providers.provider("Form", FormProvider_);

function FormProvider_ () {

  var _ref,
      _ref_key,
      _ref_stream,
      // TODO: sync this with firebase instead of caching it locally
      prospect,
      forms_url;

  _ref_key  =  null;
  forms_url = 'https://scty.firebaseio.com/forms/'; // hack: hardcode // todo: make this constant value

  this.setRefKey = function(key){
    /* jshint -W030 */
    key && (_ref_key = key);
    /* jshint +W030 */
    // console.log('ref_key in sessionProvider being set:', key);
  };

  this.$get = ["Clientstream",function formProviderFactory(Client) {


    Client.listen('Session: Loaded', bootstrapForm);
    Client.listen('valid zip', updateZipOnRef);// TODO: fix line use Client.listen('valid format', updateRefByKey ); or something
    Client.listen('Form: valid house', updateRefByVal );
    Client.listen('Form: valid data', updateRefByVal);

    function bootstrapForm (argument) {
      // make the ref when Form is first required.
      if (_ref_key) {
        // load the _ref from the user's previous session
        _ref = new Firebase(forms_url).child(_ref_key);
      } else {
        // there was no form, make a new one
        _ref = new Firebase(forms_url).push();
      }
      _ref.once('value', processNewFormFromFirebase );
      return _ref;
    }

    function processNewFormFromFirebase (ds) {
      var data = ds.exportVal() || {};
      _ref_key = ds.ref().key();
      data.form_id = ds.ref().key();
      prospect = data;
      _ref_stream = _ref.observe('value');
      Client.emit('Form: Loaded', data);
    }

    function updateZipOnRef (zip) {
      return _ref.update({zip: zip});
    }

    function updateRefByVal (obj) {
      _ref.update(obj);
      return

    }
    Client.listen('valid address', function (addy) {
      return _ref.update({address: addy});
    });

    function awesome_form_builder_brah() {
      return {
        ref:    function(key){
          if (key) {
            _ref = new Firebase(forms_url).child(key);
            _ref.once('value', processNewFormFromFirebase );
          }
          return _ref;
        },
        id:     function(){ return _ref.key(); },
        form_stream: function(){ return _ref_stream; },
        prospect: function(){ return prospect; },
      };
    }

    // always save your firebase references when you create them
    return new awesome_form_builder_brah();
  } ];
}
