directives.directive('flnShareProposal',['Clientstream', flnShareProposal]);

function flnShareProposal (Client) {
  return {
    templateUrl: 'templates/directives/dialogs/flnShareProposal.html',
    require: '^flnModal',
    link: function (scope, elem, attrs, ModalCtrl) {
      var email_string;

      $(elem).find('#submit_email').on('click', function (evt) {
        evt.preventDefault();
        email_string = $('#prospect_email').val();
        Client.emit('Modal: email submitted', email_string);
        ModalCtrl.close();
      })
    },
  };
}
