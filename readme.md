### TO USE
##### Local:
1. `npm i`
2. Create an auth file:
    1. Create a Google Cloud Services project
    2. Scope Vision API to your project
    3. Download the auth json
    4. Add it to this folder renamed "./mdtGoogleApiCreds.json"
3. Add a portrait mode war screenshot to the folder titled "image" with format .png
4. `node localRunner.js`

##### On Discord:
- Use command `$war` with an attached screenshot

### TODO
##### Primary goals:
- fix edge cases
- implement raid stat reading functionality
- consider adding a `$help` command

##### For readme:
- add images as examples
- display the flow in the readme

### HARDCODED REGEX
- For mistakes that are consistent by the OCR, I've added some regex to make replacements.  The list is included below:
    - "%" to "2"
    - "끄" to "11"
    - "扣" to "0"
    - "口" to "0"
    - "g" to "9"
    - "日" to "8"