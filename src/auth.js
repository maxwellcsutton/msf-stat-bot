import fs from "fs"
import dotenv from "dotenv"

export default class {
    async setEnvVars() {
        dotenv.config({ path: '../.env' })
        fs.writeFileSync("../config/mdtGoogleApiCreds.json", process.env.CREDS)
    }
}