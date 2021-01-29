### TO USE
- npm i
- create "./mdtGoogleApiCreds.json" file
- node readWarImage.js

### TODO
Primary goals:
- fix edge cases

Nice to haves:
- figure out better way of handling randomly added characters
- figure out how to deal with dumb usernames
- create a discord bot

For readme:
- add images as examples
- display the flow in the readme

### IDEAS
- regex for things that would be on an unedited screenshot and return an error
- make the app doctor the screenshots for me - add war raid-result raid-leaderboard as params to the discord bot call?

### DUMB USERNAME TEST CASES
- spaces
- numbers
- single characters seperated by spaces
- numbers seperated by spaces
- multiple spaces per name
- special characters in names (prob just going to ignore)

### HARDCODED REGEX
- For mistakes that are consistent by the OCR, I've added some regex to make replacements.  The list is included below:
    - "%" to "2"
    - "끄" to "11"
    - "扣" to "0"
    - "口" to "0"