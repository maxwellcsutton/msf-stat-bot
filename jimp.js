import jimp from "jimp"

export default class {

    /*
    This file takes the input (image1.png) and outputs split and resized images from each column to make it easier
    for the Vision API to parse the numbers consistently.  This is done because the input images will not be a consistent
    size, so they need to be cleaned in order to be passed properly into the Vision API.
    */
    

    files = []

    // for testing purposes only
    async getTestImage(){
        try {
            const image = await jimp.read("image1.png")
            await image.resize(1080, 1920)
            await image.write("test.png")
            console.log("test image written")
        } catch (err){
            console.log(err)
        }
    }
  
    async getWarNames(){
        try {
            const image = await jimp.read("image1.png")
            await image.resize(1080, 1920)
            await image.crop(154, 119, 237, 1657)
            await image.write("warNames.png")
            this.files.push("warNames")
            console.log("warNames written")
        } catch (err){
            console.log(err)
        }
    }

    async getAttackPoints(){
        try {
            const image = await jimp.read("image1.png")
            await image.resize(1080, 1920)
            await image.crop(440, 119, 104, 1657)
            await image.write("warAttackPoints.png")
            this.files.push("warAttackPoints")
            console.log("warAttackPoints written")
        } catch (err){
            console.log(err)
        }
    }

    async getAttacks(){
        try {
            const image = await jimp.read("image1.png")
            await image.resize(1080, 1920)
            await image.crop(587, 119, 50, 1657)
            // because the vision API isn't good at recognizing single digits, we need to add a # in front to make it recognize that it's a number
            // starts at 25, every 69 px after
            const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE)
            let digitPxArr = [25]
            let additionalIndexes = 23
            for (let i = 0; i <= additionalIndexes; i++){
                digitPxArr.push(digitPxArr[i] + 69)
                await image.print(font, 4, digitPxArr[i], "#")
            }
            await image.write("warAttacks.png")
            this.files.push("warAttacks")
            console.log("warAttacks written")
        } catch (err){
            console.log(err)
        }
    }

    async getDamage(){
        try {
            const image = await jimp.read("image1.png")
            await image.resize(1080, 1920)
            await image.crop(676, 119, 104, 1657)
            await image.write("warDamage.png")
            this.files.push("warDamage")
            console.log("warDamage written")
        } catch (err){
            console.log(err)
        }
    }

    async getDefensiveWins(){
        try {
            const image = await jimp.read("image1.png")
            await image.resize(1080, 1920)
            await image.crop(830, 119, 50, 1657)
            // because the vision API isn't good at recognizing single digits, we need to add a # in front to make it recognize that it's a number
            // starts at 25, every 69 px after
            const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE)
            let digitPxArr = [25]
            let additionalIndexes = 23
            for (let i = 0; i <= additionalIndexes; i++){
                digitPxArr.push(digitPxArr[i] + 69)
                await image.print(font, 4, digitPxArr[i], "#")
            }
            await image.write("warDefensiveWins.png")
            this.files.push("warDefensiveWins")
            console.log("warDefensiveWins written")
        } catch (err){
            console.log(err)
        }
    }

    async getDefensiveBoosts(){
        try {
            const image = await jimp.read("image1.png")
            await image.resize(1080, 1920)
            await image.crop(940, 119, 50, 1657)
            // because the vision API isn't good at recognizing single digits, we need to add a # in front to make it recognize that it's a number
            // starts at 25, every 69 px after
            const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE)
            let digitPxArr = [25]
            let additionalIndexes = 23
            for (let i = 0; i <= additionalIndexes; i++){
                digitPxArr.push(digitPxArr[i] + 69)
                await image.print(font, 4, digitPxArr[i], "#")
            }
            await image.write("warDefensiveBoosts.png")
            this.files.push("warDefensiveBoosts")
            console.log("warDefensiveBoosts written")
        } catch (err){
            console.log(err)
        }
    }

    async getNumber(){
        try {
            const image = await jimp.read("image1.png")
            await image.resize(1080, 1920)
            await image.crop(441, 119, 574, 1657)
            await image.write("numbers.png")
            this.files.push("numbers")
            console.log("numbers written")
        } catch (err){
            console.log(err)
        }
    }

    async createAll() {
        await this.getWarNames()
        await this.getAttackPoints()
        await this.getAttacks()
        await this.getDamage()
        await this.getDefensiveWins()
        await this.getDefensiveBoosts()
        // await this.getNumber()
        return this.files    
    }

}