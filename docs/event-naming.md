# How to name ReactiveJS stream events

Let's use the scientific method, and our powers of deduction and induction, to construct a robust scheme for naming the events in our RxJS-enhanced Angular app.

## Premises
* An event may have more than one emitter.
* An event may have more than one listener.
* Most events have a small number of emitters.
* Some events have more than one listener.
* Most events have a primary function.
* Some events have ancillary functions.

## Hypotheses
* Knowing the primarily intended listener for an event will lend it more context and quicker recognition than any other characteristic.
* Events emitted are actions occurring (now slightly) in the past, and should be formed as such, e.g., 'wrote event naming docs' or 'saved event naming docs' (we'll revisit syntax below)
* 
