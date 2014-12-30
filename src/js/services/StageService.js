function StageService_ ($state, FBURL, TemplateConfig) {
  /* ================================
    StageService

    provides a SyncObject with the following methods:
      next() -- move forward in flow
      prev() -- move backward in flow

    structures the user flow, e.g.:
      * Stage 1
          * Step A
          * Step B
          * Step C
      * Stage 2
          * Step A
          * Step B
      etc...

    TODO:
      make a private history function that keeps a record of what you've done
      move config_object to $provider

    TODO: flesh out the stageCtrl, see `docs/stages+states.md`

  ================================ */



  var stage_stream, // stage events
      step_stream,  //
      state_stream;

  var StageService = {};

  var config_object = TemplateConfig.config;  // TODO: this shouldn't be here
  StageService.config = config_object;

  var _current = {
    stage: 0,
    step:  0,
    history: _history,
  };

  var _history = []; // TODO: state objects go here

  return StageService;
}

angular.module('flannel').service('StageService', StageService_);
