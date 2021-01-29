import Jimp from "./jimp.js"
import Vision from "./googleVision.js"
import Storage from "./googleStorage.js"
import Output from "./output.js"

const jimp = new Jimp()
const vision = new Vision()
const storage = new Storage()
const output = new Output()

async function test() {
    let test = await output.outputData()
        //let test = await jimp.getWarNames()
    console.log(test)
}

test()

let playerNames = "TeriasAllsparkXForceJerlisAllsparkXForCeTambeiAllsparkXForceFeu77AllsparkXForceWhoDeyKevinAllsparkXForceTsengAllsparkXForceMarcosAllsparkXForcCeDOMPOMSPAllsparkXForceVeemon17AllsparkXForceInfernalCrackLEDNAllsparkXForceLj2playAllsparkXForcegrizzadamsAllsparkXForceSlatoriousAllsparkXForCeMikey25125AllsparkXForceRandomjoe19AllsparkXForceawktAllsparkXForceHellzyAllsparkXForceAncaleAllsparkXForceFredAllsparkXForceDakianTeroAllsparkXForceRocketAceAllsparkXForceOptimistPrimeAllsparkXForceFloAllsparkXForCeWaldos_wartortleAllsparkXForce"