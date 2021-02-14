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
        let attacksStart = { startXCrop: 540, numX: 588, startYCrop: 106, numY: 184 }
        let defensiveWinsStart = { startXCrop: 809, numX: 856, startYCrop: 105, numY: 184 }
        let defensiveBoostsStart = { startXCrop: 942, numX: 991, startYCrop: 103, numY: 184 }
        let increment = 88

        let xRatio = 72 / bounds.startNamesBound.x
        let yRatio = 92 / bounds.startNamesBound.y
        console.log("x ratio: ", xRatio)
        console.log("y ratio: ", yRatio)

        let x
        let y

        if (type === "attacks") {
            x = (attacksStart.numX / xRatio - attacksStart.startXCrop / xRatio) - 22
            console.log(`x = (${attacksStart.numX} / ${xRatio} - ${attacksStart.startXCrop} / ${xRatio}) - 22`)
            y = (attacksStart.numY / yRatio - attacksStart.startYCrop / yRatio) - 4
            console.log(`y = (${attacksStart.numY} / ${yRatio} - ${attacksStart.startYCrop} / ${yRatio})`)
            increment = increment / yRatio
            console.log(x, y, increment)
        } else if (type === "defensiveWins") {
            x = (defensiveWinsStart.numX / xRatio - defensiveWinsStart.startXCrop / xRatio) - 22
            y = (defensiveWinsStart.numY / yRatio - defensiveWinsStart.startYCrop / yRatio) - 4
            increment = increment / yRatio
        } else if (type === "defensiveBoosts") {
            x = (defensiveBoostsStart.numX / xRatio - defensiveBoostsStart.startXCrop / xRatio) - 22
            y = (defensiveBoostsStart.numY / yRatio - defensiveBoostsStart.startYCrop / yRatio) - 4
            increment = increment / yRatio
        } else {
            return
        }
        const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)
        let digitPxArr = [y]
        let additionalIndexes = 23
        console.log("adding hashtags:")
        for (let i = 0; i <= additionalIndexes; i++) {
            digitPxArr.push(digitPxArr[i] + increment)
                //console.log(`# at ${x},${digitPxArr[i]}`)
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
            let w = bounds.endNamesBound.x - startX
            let h
            if (bounds.chatBox) {
                h = bounds.chatBox.y - startY
            } else {
                h = image.bitmap.height - startY - 75
            }
            console.log(`war names bounds: x ${startX}, y: ${startY}, w: ${w}, h: ${h}`)
            await image.crop(startX, startY, w, h)
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
            let w = bounds.endAttackPointsBound.x - startX
            let h
            if (bounds.chatBox) {
                h = bounds.chatBox.y - startY
            } else {
                h = image.bitmap.height - startY - 75
            }
            console.log(`AP bounds: x ${startX}, y: ${startY}, w: ${w}, h: ${h}`)
            await image.crop(startX, startY, w, h)
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
            console.log("precrop h: ", image.bitmap.height)
            let startX = bounds.startAttacksBound.x
            let startY = bounds.endAttacksBound.y
            let w = bounds.endAttacksBound.x - startX
            let h
            if (bounds.chatBox) {
                h = bounds.chatBox.y - startY
            } else {
                h = image.bitmap.height - startY - 75
            }
            console.log(`atk bounds: x ${startX}, y: ${startY}, w: ${w}, h: ${h}`)
            await image.crop(startX, startY, w, h)
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
            let w = bounds.endDamageBound.x - startX
            let h
            if (bounds.chatBox) {
                h = bounds.chatBox.y - startY
            } else {
                h = image.bitmap.height - startY - 75
            }
            console.log(`dmg bounds: x ${startX}, y: ${startY}, w: ${w}, h: ${h}`)
            await image.crop(startX, startY, w, h)
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
            let w = bounds.endDefensiveWinsBound.x - startX
            let h
            if (bounds.chatBox) {
                h = bounds.chatBox.y - startY
            } else {
                h = image.bitmap.height - startY - 75
            }
            console.log(`dw bounds: x ${startX}, y: ${startY}, w: ${w}, h: ${h}`)
            await image.crop(startX, startY, w, h)
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
            let w = bounds.endDefensiveBoostsBound.x - startX
            let h
            if (bounds.chatBox) {
                h = bounds.chatBox.y - startY
            } else {
                h = image.bitmap.height - startY - 75
            }
            console.log(`db bounds: x ${startX}, y: ${startY}, w: ${w}, h: ${h}`)
            await image.crop(startX, startY, w, h)
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
        try {
            this.files = []
            let image = await this.getImage(screenshot)
            await this.getWarNames(image, bounds)
            await this.getWarAttackPoints(image, bounds)
            await this.getWarAttacks(image, bounds)
            await this.getWarDamage(image, bounds)
            await this.getWarDefensiveWins(image, bounds)
            await this.getWarDefensiveBoosts(image, bounds)
                // await this.getNumber()
            return this.files
        } catch (err) {
            console.log(err)
        }
    }

}