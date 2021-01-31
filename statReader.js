import Jimp from "./jimp.js"
import Gv from "./googleVision.js"
import Gcs from "./googleStorage.js"
import Output from "./output.js"

export default class {

    jimp = new Jimp()
    gv = new Gv()
    gcs = new Gcs()
    output = new Output()

    async runWarApp(screenshot) {
        // let image = await this.gcs.uploadFile("war-screenshots", screenshot)
        let imagesArray = await this.jimp.createAll(screenshot)
        let warFiles = await this.gcs.uploadWarFiles(imagesArray)
        let textAnnotations = await this.gv.getTextWar(warFiles)
        let csv = await this.output.outputData(textAnnotations)
        return csv
    }

}