module.exports = function(app) {
  var request       = require('request'),
      querystring   = require('querystring'),
      env           = process.env.NODE_ENV || 'development',
      conf          = require('../config/environments/' + env + '.json');

  function proxyGET(url, res) {
    request({
      rejectUnauthorized: false,
      url: url
    }).pipe(res);
  }

  function proxyPOST(url, body, res) {
    request({
      rejectUnauthorized: false,
      url: url,
      method: 'POST',
      json: body
    }).pipe(res);
  }

  function ahj(req, res) {
    var url = [
      conf.AHJ_API,
      '/ahjs/near.json?',
      querystring.stringify(req.query)
    ].join('');

    proxyGET(url, res);
  }

  function utilities(req, res) {
    var url = [
      conf.SOLAR_WORKS_ROOT,
      conf.UTILITIES_API,
      'city/' + req.query.city,
      '/zip/' + req.query.zip
    ].join('');

    proxyGET(url, res);
  }

  function warehouses(req, res) {
    var url = [
      conf.SOLAR_WORKS_ROOT,
      conf.WAREHOUSE_API,
      'zip/' + req.query.zip
    ].join('');

    proxyGET(url, res);
  }

  function rates(req, res) {
    var url = [
      conf.SOLAR_WORKS_ROOT,
      conf.RATES_API,
      'utilityid/' + req.query.utilityid
    ].join('');

    proxyGET(url, res);
  }

  function creditCheck(req, res) {
    var url = [
      conf.SOLAR_WORKS_API_ROOT,
      conf.CREDIT_CHECK_API
    ].join('');

    proxyPOST(url, req.body, res);
  }

  function contact(req, res) {
    var url = [
      conf.SOLAR_WORKS_API_ROOT,
      conf.CONTACT_API
    ].join('');

    proxyPOST(url, req.body, res);
  }

  function surveyQuestions(req, res) {
    var url = [
      conf.SOLAR_WORKS_API_ROOT,
      conf.SURVEY_QUESTIONS_API
    ].join('');

    proxyPOST(url, req.body, res);
  }

  function nearMe(req, res) {
    var url = [
      conf.NEAR_ME_ROOT,
      conf.NEAR_ME_API,
      '?format=json&',
      querystring.stringify(req.query)
    ].join('');

    proxyGET(url, res);
  }

  function gsa(req, res) {
    var url = [
      conf.GSA_ROOT,
      conf.GSA_API,
      req.query.installationGuid
    ].join('');

    proxyGET(url, res);
  }

  function schedule(req, res) {
    var url = [
      conf.GSA_ROOT,
      conf.GSA_API,
      req.body.installationGuid,
      '?_DateTime=' + req.body.dateTime
    ].join('');

    proxyPOST(url, req.body, res);
  }

  function installation(req, res) {
    var installationType = req.body.FullInstallation ? conf.FULL_INSTALLATION_API : conf.INSTALLATION_API;

    var url = [
      conf.SOLAR_WORKS_API_ROOT,
      installationType
    ].join('');

    proxyPOST(url, req.body, res);
  }

  function panelFill(req, res) {
    var url = [
      conf.PANEL_FILL_ROOT,
      conf.PANEL_FILL_API,
      '?',
      querystring.stringify(req.query)
    ].join('');

    proxyGET(url, res);
  }

  return {
    ahj: ahj,
    utilities: utilities,
    warehouses: warehouses,
    rates: rates,
    creditCheck: creditCheck,
    contact: contact,
    surveyQuestions: surveyQuestions,
    nearMe: nearMe,
    gsa: gsa,
    schedule: schedule,
    installation: installation,
    panelFill: panelFill
  };
};
