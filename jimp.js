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

    async addHashtags(type, bounds, image) {
        /*
        Because the vision API isn't good at recognizing single digits,
        we need to add a # in front to make it recognize that it's a number.
        Since various users will have the attacks, defensive wins, and boosts in different locations,
        we need to create image ratios based off the difference in pixels between a base image and the
        image that the user inputs
        */
        let attacksStart = { x: 588, y: 184 }
        let defensiveWinsStart = { x: 856, y: 184 }
        let defensiveBoostsStart = { x: 991, y: 184 }
        let increment = 88

        let xRatio = 72 / bounds.startNamesBound.x
        let yRatio = 105 / bounds.startNamesBound.y
        console.log("x ratio: ", xRatio)
        console.log("y ratio: ", yRatio)

        let x = 0
        let y = 0

        if (type === "attacks") {
            x = bounds.startAttacksBound.x - attacksStart.x * xRatio
            y = bounds.startAttacksBound.y - attacksStart.y * yRatio
            increment = increment * yRatio
        } else if (type === "defensiveWins") {
            x = bounds.startDefensiveWinsBound.x - defensiveWinsStart.x * xRatio
            y = bounds.startDefensiveWinsBound.y - defensiveWinsStart.y * yRatio
            increment = increment * yRatio
        } else if (type === "defensiveBoosts") {
            x = bounds.startDefensiveBoostsBound.x - defensiveBoostsStart.x * xRatio
            y = bounds.startDefensiveBoostsBound.y - defensiveBoostsStart.y * yRatio
            increment = increment * yRatio
        } else {
            return
        }
        const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)
        let digitPxArr = [y]
        let additionalIndexes = 23
        console.log("adding hashtags:")
        for (let i = 0; i <= additionalIndexes; i++) {
            console.log(`# at ${x},${y}`)
            digitPxArr.push(digitPxArr[i] + increment)
            console.log(`# at ${x},${digitPxArr[i]}`)
            await image.print(font, x, digitPxArr[i], "#")
        }
        let output = image
        return output
    }

    async getWarNames(screenshot, bounds) {
        try {
            const image = await jimp.read(screenshot)
            let startX = bounds.startNamesBound.x
            let startY = bounds.endNamesBound.y
            let width = bounds.endNamesBound.x - startX
                // !--TODO: Ask Adam if its better to use this if/else or just set height = image.bitmap.height and have an if with no else
            let height = 0
            if (bounds.chatBox) {
                height = bounds.chatBox.y - startY
            } else {
                height = image.bitmap.height - startY
            }
            console.log(`war names bounds: x ${startX}, y: ${startY}, w: ${width}, h: ${height}`)
            await image.crop(startX, startY, width, height)
            await image.write("warNames.png")
            this.files.push("warNames.png")
            console.log("warNames written")
        } catch (err) {
            console.log(err)
        }
    }

    async getWarAttackPoints(screenshot, bounds) {
        try {
            const image = await jimp.read(screenshot)
            let startX = bounds.startAttackPointsBound.x
            let startY = bounds.endAttackPointsBound.y
            let width = bounds.endAttackPointsBound.x - startX
            let height = 0
            if (bounds.chatBox) {
                height = bounds.chatBox.y - startY
            } else {
                height = image.bitmap.height - startY
            }
            console.log(`AP bounds: x ${startX}, y: ${startY}, w: ${width}, h: ${height}`)
            await image.crop(startX, startY, width, height)
            await image.write("warAttackPoints.png")
            this.files.push("warAttackPoints.png")
            console.log("warAttackPoints written")
        } catch (err) {
            console.log(err)
        }
    }

    async getWarAttacks(screenshot, bounds) {
        try {
            const image = await jimp.read(screenshot)
            let startX = bounds.startAttacksBound.x
            let startY = bounds.endAttacksBound.y
            let width = bounds.endAttacksBound.x - startX
            let height = 0
            if (bounds.chatBox) {
                height = bounds.chatBox.y - startY
            } else {
                height = image.bitmap.height - startY
            }
            console.log(`atk bounds: x ${startX}, y: ${startY}, w: ${width}, h: ${height}`)
            await image.crop(startX, startY, width, height)
            let newImage = await this.addHashtags("attacks", bounds, image)
            await newImage.write("warAttacks.png")
            this.files.push("warAttacks.png")
            console.log("warAttacks written")
        } catch (err) {
            console.log(err)
        }
    }

    async getWarDamage(screenshot, bounds) {
        try {
            const image = await jimp.read(screenshot)
            let startX = bounds.startDamageBound.x
            let startY = bounds.endDamageBound.y
            let width = bounds.endDamageBound.x - startX
            let height = 0
            if (bounds.chatBox) {
                height = bounds.chatBox.y - startY
            } else {
                height = image.bitmap.height - startY
            }
            console.log(`dmg bounds: x ${startX}, y: ${startY}, w: ${width}, h: ${height}`)
            await image.crop(startX, startY, width, height)
            await image.write("warDamage.png")
            this.files.push("warDamage.png")
            console.log("warDamage written")
        } catch (err) {
            console.log(err)
        }
    }

    async getWarDefensiveWins(screenshot, bounds) {
        try {
            const image = await jimp.read(screenshot)
            let startX = bounds.startDefensiveWinsBound.x
            let startY = bounds.endDefensiveWinsBound.y
            let width = bounds.endDefensiveWinsBound.x - startX
            let height = 0
            if (bounds.chatBox) {
                height = bounds.chatBox.y - startY
            } else {
                height = image.bitmap.height - startY
            }
            console.log(`dw bounds: x ${startX}, y: ${startY}, w: ${width}, h: ${height}`)
            await image.crop(startX, startY, width, height)
            let newImage = await this.addHashtags("defensiveWins", bounds, image)
            await newImage.write("warDefensiveWins.png")
            this.files.push("warDefensiveWins.png")
            console.log("warDefensiveWins written")
        } catch (err) {
            console.log(err)
        }
    }

    async getWarDefensiveBoosts(screenshot, bounds) {
        try {
            const image = await jimp.read(screenshot)
            let startX = bounds.startDefensiveBoostsBound.x
            let startY = bounds.endDefensiveBoostsBound.y
            let width = bounds.endDefensiveBoostsBound.x - startX
            let height = 0
            if (bounds.chatBox) {
                height = bounds.chatBox.y - startY
            } else {
                height = image.bitmap.height - startY
            }
            console.log(`db bounds: x ${startX}, y: ${startY}, w: ${width}, h: ${height}`)
            await image.crop(startX, startY, width, height)
            let newImage = await this.addHashtags("defensiveBoosts", bounds, image)
            await newImage.write("warDefensiveBoosts.png")
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

    async createAll(screenshot, bounds) {
        let image = await this.getImage(screenshot)
        this.files = []
        await this.getWarNames(image, bounds)
        await this.getWarAttackPoints(image, bounds)
        await this.getWarAttacks(image, bounds)
        await this.getWarDamage(image, bounds)
        await this.getWarDefensiveWins(image, bounds)
        await this.getWarDefensiveBoosts(image, bounds)
            // await this.getNumber()
        return this.files
    }

}