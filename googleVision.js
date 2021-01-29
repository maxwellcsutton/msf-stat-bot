import vision from "@google-cloud/vision"
import fs from "fs"
import Jimp from "./jimp.js"
import Storage from "./googleStorage.js"

export default class {

    async getTextWar() {

        // sets up the credentials
        let creds = fs.readFileSync("./mdtGoogleApiCreds.json")
        let projectId = JSON.parse(creds).project_id
        let keyFilename = "./mdtGoogleApiCreds.json"

        // Creates a client and initializes google storage class
        let client = new vision.ImageAnnotatorClient({ projectId, keyFilename })

        let storage = new Storage()

        let warFileUrls = await storage.uploadWarFiles()

        // Sets the type of annotation you want to perform on the image
        const features = [{ type: "TEXT_DETECTION" }];

        // Constructs the image requests to be passed into the batchAnnotate method
        let imageRequestsArr = []
        warFileUrls.forEach((elem) => {
            console.log(elem)
            let reqObj = {
                image: {
                    source: {
                        imageUri: elem,
                    },
                },
                features: features,
            }
            imageRequestsArr.push(reqObj)
        })

        // Adds each image request object to the batch request
        const request = {
            requests: imageRequestsArr,
            imageContext: {
                languageHints: ["en"]
            },
        };

        // Calls batchAnnotate method on the requests constructed above
        const [result] = await client.batchAnnotateImages(request);
        let data = result.responses

        // Creates an array of the data that is returned from batchAnnotate method
        let warTextArr = []
        data.forEach((elem) => {
            let textAnnotations = elem.textAnnotations
            let descriptionArray = []
            textAnnotations.forEach((e) => {
                descriptionArray.push(e.description)
            })
            warTextArr.push(descriptionArray)
        })

        // This relies on the API calls returning in the correct order, if I make any changes to the image function orders, this will need to be refactored
        let warTextObj = {
            warNames: warTextArr[0],
            warAttackPoints: warTextArr[1],
            warAttacks: warTextArr[2],
            warDamage: warTextArr[3],
            warDefensiveWins: warTextArr[4],
            warDefensiveBoosts: warTextArr[5]
        }
        return warTextObj
    }
}