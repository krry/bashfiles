# firebase 

## Outline
We'll keep objects of various types in firebase: 

  * Routing (an always up-to-date array of available agents)
  * Users: 
    * Prospects
    * Agents
  * Designs
  * Call_sessions

## Storage Objects

### Routing
  
  provides a quick lookup for round-robin distribution of prospects to agents

  routing: {
    available_agents: [Agents....],
    waiting_prospects: [Prospects...],
  }

### Users

  two types of users: 
    prospects, who use the online sales tool to estimate their home's production
    agents, who are standing by

  users: {
    prospects: {
      prospect_idA: {},
      prospect_idB: {},
      prospect_idC: {},
    },
    agents: {
      agent_idA: {},
      agent_idB: {},
      agent_idC: {},
    }
  }

#### Prospects

  prospects: {
    prospect_id: {
      name:              "name",
      prospects_designs: [Designs...],
      prospects_calls:   [Call_sessions...]
    },
  }
    
#### Agents

  agents: {
    agent_id: {
      status:       [chatting/available/hold/break/etc...],
      current_call: "call_session_id",
      call_history: ["call_session_id",]
    },
  }

### Designs

  designs are the objects that will enable the application to stay in sync.

  designs: {
    design_id:{
      event_log:  [{event},{event},{event},...],
      home: {
        address1: "address1",
        address2: "address2",
        city:     "city",
        state:    "state",
        zip:      "11111",
        areas: {
          area_id: {
            geometry:     "polygon((blahblablhablh))",
            slope:        "10",
            obstrucitons: [{point},{point},{point}...]
          },
        },
      },
      owner:          "prospect_id",
      agent_history:  ["agent_id","agent_id","agent_id",...]
    }
  }

### Call_sessions

  tenhands calls may be built by th, or they may be built by SC. TBD.

  calls: {
    session_id: {
      agent:      "agent_id",
      prospect:   "prospect_id",
      design:     "design_id",
      tenhands:   "tenhandsIdentifyer???",
      start_time: "timetimetime",
      end_time:   "timetimetime",
    }
  }




## how do we sync? 

var test = new Firebase('https://scty.firebaseio.com/features')
var wkt = new ol.format.WKT();
test.push(wkt.writeFeature(feature))



after mount draw: (rather than getting the pixel data, we should get the LatLng data)
 
get all the feature's relevant keys
    event.feature.getKeys()
    - id
    - geometry / wkt
    - gutterline

our reference object is something like ~/designId/features/[featureId]

if featureId already exists, then $update

else create featureId
