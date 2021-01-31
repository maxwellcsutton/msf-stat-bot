import jimp from "jimp"

export default class {

    /*
    This file takes the input (image.png) and outputs split and resized images from each column to make it easier
    for the Vision API to parse the numbers consistently.  This is done because the input images will not be a consistent
    size, so they need to be cleaned in order to be passed properly into the Vision API.
    */


    files = []

    // constructs the image
    async getImage(screenshot) {
        // checks if an image param is supplied
        // this allows the app to run on the discord bot
        if (screenshot) {
            try {
                const image = await jimp.read(screenshot)
                console.log(`using screenshot from url: ${screenshot}`)
                return image
            } catch (err) {
                console.log(err)
            }
        } else {
            // returns the path to the local image if no image parameter is supplied
            // this allows the app to be run locally
            return "image.png"
        }

    }

    async getWarNames(screenshot) {
        try {
            const image = await jimp.read(screenshot)
            let symbolCensor = new jimp(31, 27, "black", (err, censor) => {
                if (err) throw err;
            });
            await image.resize(1080, 1920)
            await image.crop(154, 119, 282, 1657)
                // censors the pfp and alliance name so only player names are exposed to the API
                // for some reason, the # of px between names isnt consistent so the array has to be hardcoded
            let digitPxArr = [34]
            let additionalIndexes = 23
            for (let i = 0; i <= additionalIndexes; i++) {
                digitPxArr.push(digitPxArr[i] + 69.25)
                await image.composite(symbolCensor, 69, digitPxArr[i])
            }
            await image.write("warNames.png")
            this.files.push("warNames.png")
            console.log("warNames written")
        } catch (err) {
            console.log(err)
        }
    }

    async getWarAttackPoints(screenshot) {
        try {
            const image = await jimp.read(screenshot)
            await image.resize(1080, 1920)
            await image.crop(440, 119, 104, 1657)
            await image.write("warAttackPoints.png")
            this.files.push("warAttackPoints.png")
            console.log("warAttackPoints written")
        } catch (err) {
            console.log(err)
        }
    }

    async getWarAttacks(screenshot) {
        try {
            const image = await jimp.read(screenshot)
            await image.resize(1080, 1920)
            await image.crop(587, 119, 50, 1657)
                // because the vision API isn't good at recognizing single digits, we need to add a # in front to make it recognize that it's a number
                // starts at 25, every 69 px after
            const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE)
            let digitPxArr = [25]
            let additionalIndexes = 23
            for (let i = 0; i <= additionalIndexes; i++) {
                digitPxArr.push(digitPxArr[i] + 69)
                await image.print(font, 4, digitPxArr[i], "#")
            }
            await image.write("warAttacks.png")
            this.files.push("warAttacks.png")
            console.log("warAttacks written")
        } catch (err) {
            console.log(err)
        }
    }

    async getWarDamage(screenshot) {
        try {
            const image = await jimp.read(screenshot)
            await image.resize(1080, 1920)
            await image.crop(676, 119, 104, 1657)
            await image.write("warDamage.png")
            this.files.push("warDamage.png")
            console.log("warDamage written")
        } catch (err) {
            console.log(err)
        }
    }

    async getWarDefensiveWins(screenshot) {
        try {
            const image = await jimp.read(screenshot)
            await image.resize(1080, 1920)
            await image.crop(830, 119, 50, 1657)
                // because the vision API isn't good at recognizing single digits, we need to add a # in front to make it recognize that it's a number
                // starts at 25, every 69 px after
            const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE)
            let digitPxArr = [25]
            let additionalIndexes = 23
            for (let i = 0; i <= additionalIndexes; i++) {
                digitPxArr.push(digitPxArr[i] + 69)
                await image.print(font, 4, digitPxArr[i], "#")
            }
            await image.write("warDefensiveWins.png")
            this.files.push("warDefensiveWins.png")
            console.log("warDefensiveWins written")
        } catch (err) {
            console.log(err)
        }
    }

    async getWarDefensiveBoosts(screenshot) {
        try {
            const image = await jimp.read(screenshot)
            await image.resize(1080, 1920)
            await image.crop(940, 119, 50, 1657)
                // because the vision API isn't good at recognizing single digits, we need to add a # in front to make it recognize that it's a number
                // starts at 25, every 69 px after
            const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE)
            let digitPxArr = [25]
            let additionalIndexes = 23
            for (let i = 0; i <= additionalIndexes; i++) {
                digitPxArr.push(digitPxArr[i] + 69)
                await image.print(font, 4, digitPxArr[i], "#")
            }
            await image.write("warDefensiveBoosts.png")
            this.files.push("warDefensiveBoosts.png")
            console.log("warDefensiveBoosts written")
        } catch (err) {
            console.log(err)
        }
    }

    /*
    // used during testing
    async getNumber() {
        try {
            const image = await jimp.read("image.png")
            await image.resize(1080, 1920)
            await image.crop(441, 119, 574, 1657)
            await image.write("numbers.png")
            this.files.push("numbers.png")
            console.log("numbers written")
        } catch (err) {
            console.log(err)
        }
    }
    */

    async createAll(screenshot) {
        let image = await this.getImage(screenshot)
        await this.getWarNames(image)
        await this.getWarAttackPoints(image)
        await this.getWarAttacks(image)
        await this.getWarDamage(image)
        await this.getWarDefensiveWins(image)
        await this.getWarDefensiveBoosts(image)
            // await this.getNumber()
        return this.files
    }

}