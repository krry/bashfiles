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
    available_agents: [agent_id....],
    waiting_prospects: [prospect_id...],
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
      prospects_designs: [design_id...],
      prospects_calls:   [session_id...]
    },
  }

#### Agents

  agents: {
    agent_id: {
      status:       [chatting/available/hold/break/etc...],
      current_call: "session_id",
      call_history: ["session_id",]
    },
  }

### Designs

  designs are the objects that will enable the application to stay in sync.

    designs: {
      design_id:{
        areas: {
          area_id: {
            geometry:     "polygon((blahblablhablh))",
            slope:        "10",
            obstructions: [{point},{point},{point}...]
          },
        },
        owner:          "prospect_id",
        session:        "session_id",
        agent_history:  ["agent_id","agent_id","agent_id",...]
      }
    }

### sessions

    sessions: {
      session_id: {
        state: {
          stage: 0,
          step:  0,
        },
        event_log:  [{event},{event},{event},...],
        agent:      "agent_id",
        prospect:   "prospect_id",
        design:     "design_id",
        tenhands:   "tenhandsIdentifyer???",
        start_time: "timetimetime",
        end_time:   "timetimetime",
      }
    }

### homes

  homes: {
    home_id: {
      owner
      address1: "address1",
      address2: "address2",
      city:     "city",
      state:    "state",
      zip:      "11111",
    },
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
