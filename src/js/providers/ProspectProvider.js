/* =========================================================

  ProspectProvider

  provides a new or existing prospect reference

  listens for changes to the prospect and syncs
  the changes to Firebase

  prospect data structure, e.g.:

  prospects: {
    prospect: {
      _id:  [prospect_id],
      name: {
        first_name: "Llamo",
        last_name: "Llama"
      },
      email:  "llamollama@domain.com",
      phone:  "6664442222",
      form:   [form_id],
      agent:  [agent_id],
      design: [design_id],
    }
  }

========================================================= */

providers.provider("Prospect", [ProspectProvider_]);

function ProspectProvider_ () {

  var prospect_ref,
      fb_observable;

  prospect_ref = new Firebase("https://scty.firebaseio.com/prospects/").push();

  fb_observable = prospect_ref.observe('value').skip(1);

  this.$get = [ "Clientstream", function prospectProviderFactory (Client) {

    Client.listen('valid email', saveEmail);

    function saveEmail (data) {
      prospect_ref.update({ email: data });
      Client.emit('email saved', data);
    }

    function prospect_assembly () {
      return {
        ref: function() { return prospect_ref; },
        id: function () { return prospect_ref.key(); },
        stream: function () { return fb_observable; },
      };
    }

    return new prospect_assembly();

}]}
