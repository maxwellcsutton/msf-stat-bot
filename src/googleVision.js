import vision from "@google-cloud/vision"
import fs from "fs"
import Jimp from "./jimp.js"
import Gcs from "./googleStorage.js"

export default class {

    // sets up the credentials
    creds = fs.readFileSync("../config/mdtGoogleApiCreds.json")
    projectId = JSON.parse(this.creds).project_id
    keyFilename = "../config/mdtGoogleApiCreds.json"

    // Creates a Vision API client
    client = new vision.ImageAnnotatorClient({ projectId: this.projectId, keyFilename: this.keyFilename })

    async getTextWar(urls) {

        // Sets the type of annotation you want to perform on the image
        const features = [{ type: "TEXT_DETECTION" }]

        // Constructs the image requests to be passed into the batchAnnotate method
        let imageRequestsArr = []
        urls.forEach((elem) => {
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
        }

        // Calls batchAnnotate method on the requests constructed above
        try {
            const [result] = await this.client.batchAnnotateImages(request)
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
        } catch (err) {
            console.log(err)
        }
    }

    async getTextLocations(image) {
        try {
            /*
                        BOUNDS:
                        Names: MY ALLIANCE start -> ATTACK start
                        Attack Points: ATTACK start -> ATTACKS start
                        Attacks: ATTACKS start -> DAMAGE start
                        Damage: DAMAGE start -> VICTORIES start
                        Def W: VICTORIES start -> DEFENSE start
                        Def Bsts: DEFENSE start -> BOOST end
                    */


            // Sets the type of annotation you want to perform on the image
            const features = [{ type: "TEXT_DETECTION" }]

            // Constructs the image requests to be passed into the batchAnnotate method
            let reqObj = [{
                image: {
                    source: {
                        imageUri: image,
                    },
                },
                features: features,
            }]

            // Adds each image request object to the batch request
            const request = {
                requests: reqObj,
                imageContext: {
                    languageHints: ["en"]
                },
            }

            // Performs text detection on the image passed in
            const [result] = await this.client.batchAnnotateImages(request)
            const detections = result.responses[0].textAnnotations
            fs.writeFileSync("textAnnotations.json", JSON.stringify(detections))

            // creates the bounds object with the start and end points of each section of the table for cropping in jimp.js
            let bounds = new Object()
            bounds.startNamesBound = null
            bounds.endNamesBound = null
            bounds.startAttackPointsBound = null
            bounds.endAttackPointsBound = null
            bounds.startAttacksBound = null
            bounds.endAttacksBound = null
            bounds.startDamageBound = null
            bounds.endDamageBound = null
            bounds.startDefensiveWinsBound = null
            bounds.endDefensiveWinsBound = null
            bounds.startDefensiveBoostsBound = null
            bounds.endDefensiveBoostsBound = null
            bounds.chatBox = null

            detections.forEach((elem, index) => {
                let text = elem.description
                let startBound = elem.boundingPoly.vertices[0]
                let endBound = elem.boundingPoly.vertices[2]
                if (text === "MYALLIANCE" || text === "MY" && detections[index + 1].description === "ALLIANCE") {
                    bounds.startNamesBound = startBound
                }
                if (text === "ATTACK") {
                    bounds.endNamesBound = { x: startBound.x, y: endBound.y + 2 }
                    bounds.startAttackPointsBound = startBound
                }
                if (text === "ATTACKS") {
                    bounds.endAttackPointsBound = { x: startBound.x, y: endBound.y + 2 }
                    bounds.startAttacksBound = startBound
                }
                if (text === "DAMAGE") {
                    bounds.endAttacksBound = { x: startBound.x, y: endBound.y + 2 }
                    bounds.startDamageBound = startBound
                }
                if (text === "DEFEND") {
                    bounds.endDamageBound = { x: startBound.x, y: endBound.y + 2 }
                    bounds.startDefensiveWinsBound = startBound
                }
                if (text === "DEFENSE") {
                    bounds.endDefensiveWinsBound = { x: startBound.x, y: endBound.y + 2 }
                    bounds.startDefensiveBoostsBound = startBound
                }
                if (text === "BOOST") {
                    bounds.endDefensiveBoostsBound = endBound
                }
                if (text === "»") {
                    bounds.chatBox = { x: startBound.x, y: startBound.y - 2 }
                }
            })
            console.log(bounds)
            return bounds
        } catch (err) {
            console.log(err)
        }



    }
}