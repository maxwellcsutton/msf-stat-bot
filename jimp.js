import jimp from "jimp"

export default class {
  
    async getWarNames(){
        try {
            const image = await jimp.read("image1.png")
            await image.resize(1080, 1920)
            await image.crop(154, 119, 237, 1657)
            await image.write("warNames.png")
            console.log("warNames written")
        } catch (err){
            console.log(err)
        }
    }

    async getAttackPoints(){
        try {
            const image = await jimp.read("image1.png")
            await image.resize(1080, 1920)
            await image.crop(440, 119, 106, 1657)
            await image.write("warAttackPoints.png")
            console.log("warAttackPoints written")
        } catch (err){
            console.log(err)
        }
    }

    // async getAttackPoints(){
    //     jimp.read("image1.png")
    //         .then((image) => {
    //             return image
    //             .resize(1080, 1920)
    //             .crop(440, 119, 106, 1657)
    //             .write("warAttackPoints.png")
    //         }). catch((err)=>{
    //             console.log(err)
    //         })
    // }
}