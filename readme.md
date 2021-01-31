### TO USE
Local:
- `npm i`
- create "./mdtGoogleApiCreds.json" file
- add a portrait mode war screenshot to the folder titled "image" with format .png
- `node test.js`

On Discord:
- connect the bot to a server
- use command `!war` with an attached screenshot


## STEPS TO USE UNTIL I MAKE IT PUBLICLY ACCESSIBLE 
- create a google platform project scoped to vision api and gcs
- create a public bucket named `war-screenshots`
- download the auth json and name it mdtGoogleApiCreds.json and put it in the folder

### TODO
Primary goals:
- fix edge cases
- implement raid stat reading functionality

Discord bot implementation:
    1. make bot read the image
    2. upload the image to gcs
    3. download the image
    4. pass the image into the jimp function

Nice to haves:
- figure out better way of handling randomly added characters
- figure out how to deal with dumb usernames

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
    - "g" to "9"