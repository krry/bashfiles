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

providers.provider("Form", ['FIREBASE_URL', FormProvider_]);

function FormProvider_ (FIREBASE_URL) {

  var _ref,
      _ref_key,
      _ref_stream,
      // TODO: sync this with firebase instead of caching it locally
      prospect,
      forms_url;

  _ref_key  =  null;
  forms_url = FIREBASE_URL + 'forms/'; // hack: hardcode // todo: make this constant value
  prospect = {}; // HACK: ensuring that directives checking for form info

  this.setRefKey = function(key){
    /* jshint -W030 */
    key && (_ref_key = key);
    /* jshint +W030 */
    // console.log('ref_key in sessionProvider being set:', key);
  };

  this.nullRefKey = function(key) {
    _ref_key = null;
  };

  this.$get = ["Clientstream", function formProviderFactory (Client) {

    Client.listen('Session: Loaded', bootstrapForm);
    Client.listen('Form: valid data', updateRefByVal);
    Client.listen('Dev: Reset form', resetForm);

    function resetForm () {
      var form_obj = {};
      _ref.set(form_obj);
      _ref.once('value', processNewFormFromFirebase );
    }
    // DEV: end

    function bootstrapForm (session_obj) {
      // make the ref when Form is first required.
      if (_ref_key) {
        // load the _ref from the user's previous session
        _ref = new Firebase(forms_url).child(_ref_key);
      } else {
        // there was no form, make a new one
        _ref = new Firebase(forms_url).push();
      }
      _ref.update({
        session_id: session_obj.session_id
      });
      _ref.once('value', processNewFormFromFirebase );
      return _ref;
    }

    function processNewFormFromFirebase (ds) {
      var data = ds.exportVal() || {};
      _ref_key = ds.ref().key();
      data.form_id = ds.ref().key();
      prospect = data;
      _ref_stream = _ref.observe('value');
      _ref_stream.subscribe(function(ds) {
        prospect = ds.exportVal();
        Client.emit('Form: Prospect updated', prospect);
      });
      Client.emit('Form: Loaded', data);
    }

    function updateRefByVal (obj) {
      return _ref.update(obj);
    }

    function awesome_form_builder_brah() {
      return {
        ref: function (key) {
          if (key) {
            _ref = new Firebase(forms_url).child(key);
            _ref.once('value', processNewFormFromFirebase );
          }
          return _ref;
        },
        id: function () { return _ref.key(); },
        form_stream: function () { return _ref_stream; },
        prospect: function () { return prospect; },
        resetForm: resetForm
        // prospect: prospect,
      };
    }

    // always save your firebase references when you create them
    return new awesome_form_builder_brah();
  } ];
}
