# MSF-STAT-BOT
### Description
This discord bot takes a user-submitted image of the war results screen from the game Marvel Strike Force and outputs a CSV with the alliance member names and statistics for the purposes of tracking attacks, damage, and defensive wins.  I'm the leader of one of the top 100 alliances in the game and I wanted to keep track of my member's statistics, but typing them out became tedious.  Once I got a stable working version for myself running locally, I added the discord bot functionality and hosted it on Heroku.  This project is currently in beta while I work on increasing the amount of supported phones/resolutions.  If you would like to have the bot added to your discord and participate in the beta testing, please message me at InfernalCrackLED#4479.

### Example

##### Input
![](/samples/image.png)

##### Output
![](/samples/output.png)

### Code Overview

#### Basic Flow

##### CSV Output
1. Images are passed into the Google Vision API using the `getTextLocations()` method to determine the bounds of the member statistics table. - `./src/googleVision.js`
2. The bounds are passed along with the image to the `createAll()` method for image manipulation using JIMP.  In order to create a consistent dataset, the image needs to be split by column before being passed again to the Vision API for text annotation (see `./samples` for sample images after they are split by column). In addition, the Google Vision API is optimized for dense text detection, so it often filters out single characters as noise.  To get around this, the `addHashtags()` method adds `#` in front of each single number to increase the success rate of the Vision API.  Because different phone screens have different resolutions, thus have the numbers in slightly different locations, the bounds from `getTextLocations()` are compared to a default image to create a distance ratio for the placement of the `#`s.  - `./src/jimp/js`
3. The images are then passed into Google Cloud Storage because the Vision API batch annotation does not accept local images.  The upload function returns an array of URLs. - `./src/googleStorage.js`
4. The array of URLs are passed into the `getTextWar()` method in the Vision API, which returns the text annotations. - `./src/googleVision.js`
5. Finally, the text annotation object is passed into the `createDataSet()` and `outputData()` methods to output a CSV with the members' names and statistics. - `./src/output.js`

##### Discord Bot
1. `setEnvVars()` method is used to take the Google Credentials JSON set in the environment variables and build it locally on the Heroku server to authorize the Google Cloud Storage and Google Vison API calls. - `./src/auth.js`
2. The discord bot checks every message sent in any supported channels for the command `$war`.
    - If an image it attached, it attempts to pass it into the CSV Output flow and returns a CSV as well as the time the process took to complete. 
    - If no image is supplied, the user is displayed an error, reminding them to add an image.
    - If any errors occur during the attempt to create an output, the user is displayed a general error.




### TO USE
##### Local:
1. `npm i`
2. Create an auth file:
    1. Create a Google Cloud Services project
    2. Scope Vision API and Google Cloud Storage to your project
    3. Download the auth json
    4. Add it to the config folder renamed "./mdtGoogleApiCreds.json"
3. Add a portrait mode war screenshot to the folder titled "image" with format .png
4. `npm start`

##### On Discord:
- Use command `$war` with an attached screenshot

### TODO
##### Primary goals:
- fix edge cases
- implement raid stat reading functionality
- tweak pixel ratio functionality to better support a wider selection of phone screen resolutions
- consider adding a `$help` command
- add better error messaging for the discord bot

### HARDCODED REGEX
- For mistakes that are consistent by the OCR, I've added some regex to make replacements.  The list is included below:
    - "%" to "2"
    - "끄" to "11"
    - "扣" to "0"
    - "口" to "0"
    - "g" to "9"
    - "日" to "8"