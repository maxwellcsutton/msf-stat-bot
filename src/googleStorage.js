import fs from "fs"
import { Storage } from "@google-cloud/storage"
import Jimp from "./jimp.js"

export default class {

    async uploadFile(bucketName, fileName) {

        // sets up the credentials
        let creds = fs.readFileSync("../config/mdtGoogleApiCreds.json")
        let projectId = JSON.parse(creds).project_id
        let keyFilename = "../config/mdtGoogleApiCreds.json"

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

    async uploadWarFiles(files) {
        // Sets the bucket name
        let bucketName = "war-screenshots"

        // Gets the images from Jimp
        let warImgUrls = []

        // Loops through the image names provided by Jimp and passes them into the uploadFile function
        for (let i = 0; i < files.length; i++) {
            let url = await this.uploadFile(bucketName, files[i])
            warImgUrls.push(url)
        }

        return warImgUrls
    }

}