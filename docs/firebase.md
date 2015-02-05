# firebase
## Outline
We'll keep objects of various types in firebase:

  * Routing (an always up-to-date array of available agents)
  * Users:
    * Prospects
    * Agents
  * Designs
  * Sessions

## Storage Objects

### Routing

  provides a quick lookup for round-robin distribution of prospects to agents

  routing: {
    available_agents: [agent_id....],
    waiting_prospects: [prospect_id...],
  }

### Users
    users: {
      <jwt.uid>: {
        user_type: {"PROSPECT", "ODA", "ADMIN", "OTHER"},
        name: {
          first_name: "Llamo",
          last_name: "Llama"
        },
        last_session:  <session_id>,
        sessions: [<sessionA_id>, <sessionB_id>, <sessionC_id>, ...],
      }
    }

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
      uuid:              "uuid",
      prospects_session: [design_id...],
      support_events:   [session_id...]
    },
  }

#### Support Events

  support_events: {
    support_event_id: {
      session: "<session_id>",
      agent: "<agent_id>",
      agent: "<agent_id>",
    }
  }

#### Session Queue


    session -> status_code ["done", "waiting"]
    session -> form_id -> form_status ["complete", "passed_credit_waiting", "needs_design_waiting"]
    session -> prospect_id -> prospect name
    session -> design_id -> design url
    session -> support event -> messages


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
        start_time: "timetimetime",
        end_time:   "timetimetime",
      }
    }

### forms

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
