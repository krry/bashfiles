# Switching environments

We want a switch to flip between development and production to change full scripts and stylesheets to minified version

the switch must start in the <environment>.json file, then propagate into the `index.html`

**gulp** has access to `index.html` before Angular does, so it makes sense to use gulp to pull those environment variables into the build

However, angular doesn't finish its first digest cycle in time to use it for conditional logic in the <head> tag, specifically this won't work to decide between minified and unminified versions of libs like jQuery, ol, and rx.

So we'll need to bump it up a level, let gulp feed those variables directly into the `index.html` rather than feeding them into Angular as constants for it to evaluate.
