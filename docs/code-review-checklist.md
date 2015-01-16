# Code Review Checklist

## Algorithmia
[ ] Does the code perform its intended function?
[ ] Are there any new lags or performance issues?

## Readability
[ ] Is all the code easily understood?
[ ] Does it follow your team's (formatting) conventions?

## Housekeeping
[ ] Did you lint?
[ ] Is there any commented out code?
[ ] Can any logging or debugging code be removed?
[ ] Are incomplete efforts tagged with TODOs?

## Efficiency
[ ] Is any code redundant or duplicative?
[ ] Is the code as modular as possible?
[ ] Can any of the code be replaced with library functions?

## Security
[ ] Can any global variables be replaced?
[ ] Do loops have a set length and correct termination conditions?
[ ] Are all data inputs checked for type, length, format, and range, then encoded?

## Comprehension
[ ] Where third-party utilities are used, are returning errors being caught?
[ ] Are output values checked and encoded?
[ ] Are invalid parameter values handled?

## Documentation
[ ] Does each new file have a header comment block?
[ ] Are all functions' purposes commented?
[ ] Are any unusual behaviors and edge cases detailed?
[ ] Is the use and function of third-party libraries documented?
[ ] Are data structures and units of measurement explained?

## Testing
[ ] Do the tests meet team coverage standards?
[ ] Could any test code be replaced with the use of an existing API?
[ ] Are there any hollow/ineffectual unit tests?
[ ] Are there too many or hidden dependencies to test?
[ ] Can objects can be initialized for testing?
[ ] Can test frameworks access methods?
[ ] Are arrays checked for "out-of-bound" errors?

-----
> adapted from Fog Creek's article [Stop More Bugs with our Code Review Checklist](http://blog.fogcreek.com/increase-defect-detection-with-our-code-review-checklist-example/)
