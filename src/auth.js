import fs from "fs"
import dotenv from "dotenv"

export default class {
    async setEnvVars() {
        let dir = "../config"
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        dotenv.config({ path: '../.env' })
        fs.writeFileSync("../config/mdtGoogleApiCreds.json", process.env.CREDS)
    }
}