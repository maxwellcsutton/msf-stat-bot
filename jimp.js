import jimp from "jimp"

export default class {

    files = []

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