module.exports = function(app) {
    var request       = require('request'),
        querystring   = require('querystring'),
        env           = process.env.NODE_ENV || 'development',
        conf          = require('../config/environments/' + env + '.json'),
        jsforce       = require('jsforce');

    var sfLoginUrl    = conf.SFLOGIN_URL,
        sfUserName    = conf.SFUSERNAME,
        sfPassword    = conf.SFPASSWORD;

    var conn = new jsforce.Connection({
      loginUrl: sfLoginUrl
    });

    var login = conn.login(sfUserName, sfPassword);

    //how do I just return the ID??
    function createLead(fields){
    return conn.sobject("Lead").create(
    {
      FirstName : fields.FirstName,
      Lastname : fields.LastName,
      Street : fields.Street,
      City : fields.City,
      State : fields.State,
      PostalCode : fields.PostalCode,
      Email : fields.Email,
      Phone : fields.Phone,
      ownerId : fields.ownerId,
      Company : fields.FirstName + ' ' + fields.Lastname,
      LeadSource : fields.LeadSource,
      Consultation_Date__c : new Date(),
      Consultation_Type__c : 'Online',
      Opportunity_Owner__c : fields.ownerId,
    }, function(err, ret){
          if (err || !ret.success) {
            return console.error(err, ret);
          }
     });
  }

  function updateLead(fields)
  {
      return conn.sobject('Lead').update(
      {
        Id : fields.LeadId,
        FirstName : fields.FirstName,
        Lastname : fields.LastName,
        Street : fields.Street,
        City : fields.City,
        State : fields.State,
        PostalCode : fields.PostalCode,
        Email : fields.Email,
        Phone : fields.Phone,
        ownerId : fields.ownerId,
        Company : fields.FirstName + ' ' + fields.Lastname,
        LeadSource : fields.LeadSource,
        Consultation_Date__c : new Date(),
        Consultation_Type__c : 'Online',
        Opportunity_Owner__c : fields.ownerId,
      }, function(err, ret) {
          if (err || !ret.success) { 
            return console.error(err, ret); 
          }
      })
  }

  function addEditLead(req, res){
    var result;
    if (req.body.LeadId)
    {
        result = login.then(updateLead.bind(this, req.body));
    }
    else
    {
       result = login.then(createLead.bind(this, req.body));
    }

    result.then(function(result) {
        res.json(result);
        // res.json({});
      }, function(err) {
        res.json(err);
      });
  }


  return {
    addEditLead: addEditLead
  };
};