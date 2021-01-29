import Vision from "./googleVision.js"
import fs from "fs"

export default class {

    vision = new Vision()

    // Creates the dataSet object from the response of the Vision API call

    async createDataSet() {
        // calls the Google Vision api
        let text = await this.vision.getTextWar()

        // the first index of the response from the Google Vision api is a batch string of all text 
        let playerNames = text.warNames.shift()
        delete text.warNames

        // removes all text between two instances of "\n" to delete the Alliance name, then removes the (ME) from the person who took the screenshot
        playerNames = playerNames.replace(/\n.*?\n/g, "-").replace(/ \(ME\)/g, "")

        // splitting the names into an array for later use for matching with other data
        playerNames = playerNames.split("-")
        playerNames = playerNames.filter(Boolean)
        console.log(playerNames)

        playerNames.forEach((elem, index) => {
            playerNames[index] = elem[0].toUpperCase() + elem.slice(1)
        })

        // creates a new dataSet object that will house the cleaned data
        let dataSet = new Object()
        dataSet.warNames = playerNames

        // cleans the added # from the damage numbers
        for (let [key, value] of Object.entries(text)) {
            value.shift()
            value = value.map(x => x.replace(/#/g, "").replace(/,/g, "").replace(/끄/g, "11").replace(/%/g, "2"))
            value = value.filter(Boolean)
            dataSet[key] = value
        }

        return dataSet
    }

    async outputData() {

        let dataSet = await this.createDataSet()

        // combines the data from the different keys of the dataSet object
        // !-- TODO: Figure out a way to do this without hardcoding so it can be re-used --
        let combinedData = dataSet.warNames.map((elem, index) => [elem, dataSet.warAttackPoints[index], dataSet.warAttacks[index], dataSet.warDamage[index], dataSet.warDefensiveWins[index], dataSet.warDefensiveBoosts[index]])

        // structures the data for csv
        combinedData.forEach((e) => {
            e.unshift("\n")
        })

        // this turns combinedData into a string because type: string is required for fs.writeFile
        combinedData = combinedData.toString()

        // prints the data to csv
        try {
            fs.writeFileSync("./outputWarText.csv", combinedData)
            console.log("**War CSV Updated**")
        } catch (error) {
            console.log(error)
        }

        console.log(combinedData)
    }


    /*

      // combines the username with the damage numbers and uppercases the first letters for sorting
      text.forEach((elem, index)=>{
          if (regAbc.test(elem.charAt(0))){
              text[index] = elem[0].toUpperCase() + elem.slice(1)
          }
          if(index % 2 == 0) {
              data.push([elem, text[index+1]])
            } else {
              return
            }
      })
      console.log(data)

      //console.log(data)

      // structures the data for csv
      data.forEach((e)=>{
          e.unshift("\n")        
          })
      data = data.sort().toString()

      // prints the data to csv
      try {
          fs.writeFileSync("./outputWarText.csv", data)
          console.log("**War CSV Updated**")
      } catch (error) {
          console.log(error)
      }
       
    }

    //writeFileWar("Allspark X-Force")

    */
}