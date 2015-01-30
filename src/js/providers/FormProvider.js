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
      fb_observable,
      // TODO: sync this with firebase instead of caching it locally
      prospect;

  forms_url = 'https://scty.firebaseio.com/forms/'; // hack: hardcode // todo: make this constant value

  _ref = new Firebase(forms_url).push();  // TODO: pass arguments to this $get method to change the fb_observable's_ref

  fb_observable = _ref.observe('value').skip(1);

  this.$get = ["Clientstream",function formProviderFactory(Client) {
    // Client.listen('add session to form', function (key) {
    //   return _ref.update({session: key});
    // });

    Client.listen('valid zip', function (zip) {
      return _ref.update({zip: zip});
    });

    Client.listen('valid address', function (addy) {
      return _ref.update({address: addy});
    });

    Client.emit('add session to form', function(key){

    });

    Client.emit('form key', _ref.key());

    function awesome_form_builder_brah() {
      return {
        ref:    function(uid){
          if (uid) {
            _ref = new Firebase(forms_url).child(uid);
            Client.emit('new form ref', {key: _ref.key()});
          }
          return _ref;
        },
        id:     function(){ return _ref.key(); },
        stream: function(){ return fb_observable; },
        prospect: function(){ return prospect; },
      };
    }

    // always save your firebase references when you create them
    return new awesome_form_builder_brah();
  } ];
}
