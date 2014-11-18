# **Stage** and **State** Controller Specs

## **Stages** are sequential and known to the user

1. Check availability aka "Home"
    * enter zip
    * enter address
    * verify roof

2. Configure
    * design system
    * save design
    * share design
    * enter usage

3. Qualify
    * submit personal info
    * submit to credit check
    * see offer

4. Signup
    * submit contact info
    * schedule a site survey
    * set a password for MySolarCity account
    * receive confirmation SMS+email

## **States** within a stage are non-sequential

* A **state** is a situation within a stage

* A **state** may have a set of partials that should be rendered in various parts of the layout, e.g. "primary", "secondary", "dialog"

* **States** must be reachable by name. We'll need a function that can be passed a state name upon a variety of events within the DOM:
    * completing the ZIP CTA => showState('goodZip') || showState('badZip')
    * tapping the "next" or "back" button => showNextState()
    * validation passes or fails => showState('goodCredit')

* **States** probably will need limited relationships to each other: next state, error state, previous state, offramp state, etc.

* If **states** share partials, we should avoid reloading the shared partials when transitioning between those states.

