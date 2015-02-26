# Making all copy editable by the copywriters

1. Add the contenteditable tag to an tag that contain copy they'll want to edit
2. Abstract the copy into a JSON document for each localization.
3. When copywriters change text locally, sync it to their Firebase instance to preserve it.

See this package for great instructions: https://github.com/doshprompt/angular-localization
