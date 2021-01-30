import fs from "fs"
import { Storage } from "@google-cloud/storage"
import Jimp from "./jimp.js"

export default class {

    async uploadFile(bucketName, fileName) {

        // sets the bucket name 

        // sets up the credentials
        let creds = fs.readFileSync("./mdtGoogleApiCreds.json")
        let projectId = JSON.parse(creds).project_id
        let keyFilename = "./mdtGoogleApiCreds.json"

        // Creates a client
        let storage = new Storage({ projectId, keyFilename });

        // Adds a unix timestamp to the file name in case multiple people use the function at the same time
        let file = Date.now() + fileName

        try {
            // Uploads a local file to the bucket
            await storage.bucket(bucketName).upload("./" + fileName, {
                gzip: true,
                destination: file,
                metadata: {
                    cacheControl: "no-cache",
                },
            });
            let url = `https://storage.googleapis.com/${bucketName}/${file}`
            console.log(url)
            return url
        } catch (err) {
            console.log(err)
        }
    }

    async uploadWarFiles() {
        // Initiates jimp class
        let jimp = new Jimp()

        // Sets the bucket name
        let bucketName = "war-screenshots"

        // Gets the images from Jimp
        let fileNamesArray = await jimp.createAll()
        let warImgUrls = []

        // Loops through the image names provided by Jimp and passes them into the uploadFile function
        for (let i = 0; i < fileNamesArray.length; i++) {
            let url = await this.uploadFile(bucketName, fileNamesArray[i])
            warImgUrls.push(url)
        }

        return warImgUrls
    }

}