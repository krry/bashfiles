providers.provider("Form", FormProvider_);

function FormProvider_ () {
  /* ================================
    form
      structures the user flow, e.g.:

    forms: {
      form_id: {
        state: {
          stage: 0,
          step:  0,
        },
        event_log:  [{event},{event},{event},...],
        agent:      "agent_id",
        prospect:   "prospect_id",
        design:     "design_id",
        start_time: "timetimetime",
        end_time:   "timetimetime",
      }
    }

    TODO:
      make a private history function that keeps a record of what you've done

  ================================ */

  var form_ref = new Firebase('https://scty.firebaseio.com/forms/').push();  // TODO: pass arguments to this $get method to change the fb_observable's_ref
  var fb_observable = form_ref.observe('value').skip(1);
  this.$get = [  "JwtService", "Clientstream", function formProviderFactory(jwt, Clientstream) {
    // auth with firebase
    jwt.jwt();

    function awesome_form_builder_brah() {
      return {
        ref:    function(){ return form_ref; },
        id:     function(){ return form_ref.key(); },
        stream: function(){ return fb_observable; },
      };
    }

    // always save your firebase references when you create them
    return new awesome_form_builder_brah();
  } ];
}
