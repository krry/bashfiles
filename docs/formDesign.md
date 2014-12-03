# FLANNEL IS A FORM

At its base, flannel is a signup form. It's primary purpose is to collect a certain set of information from our prospects, and to this as efficiently and enjoyably as possible. To this end, we can design the whole app to be encompassed by a form, being careful to avoid accidental submission or over-validation.

## ANGULAR and proper form design

In order to ensure that the user's data is properly secured and validated, we'll wrap most of the app in a `<form>`. This form will employ the `novalidate` attribute to avoid HTML5 validation defaults that vary from browser-to-browser. The form is itself a directive with access to outside scope via the `transclude` option.

Within this form, we'll build directives for each important bit of info we aim to collect from a prospect. A directive for **ZIP**, and one for **name**, and so on, each with a controller and a link function to validate, purify, and respond to the values entered as the prospect proceeds.
