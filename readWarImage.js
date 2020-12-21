import vision from '@google-cloud/vision'
import fs from "fs"
import Jimp from "./jimp.js"
const creds = fs.readFileSync("./mdtGoogleApiCreds.json")


const projectId = JSON.parse(creds).project_id
const keyFilename = "./mdtGoogleApiCreds.json"

// Creates a client and initializes jimp class
const client = new vision.ImageAnnotatorClient({projectId, keyFilename})

const jimp = new Jimp()

// const warFileNames = ["warNames.png", "warAttackPoints.png"]

// Performs text detection on the local file

async function getTextWar(){

    let warFileNames = await jimp.createAll()

    console.log(warFileNames)

    let responseData = {}

    for (const fileName of warFileNames){
        const [result] = await client.textDetection(fileName + ".png")
        const detections = result.textAnnotations
        let descArray = []
        responseData[fileName] = descArray
        detections.forEach((e)=>{
        let data = e.description
        descArray.push(data)
        })
    }
    for (const arr in responseData){
        console.log(arr, responseData[arr].length)
    }
    fs.writeFileSync("rawData.json", JSON.stringify(responseData))
    return responseData
}

let res = await getTextWar()
console.log(res)

async function createNames(name){
    // calls the Google Vision api
    let text = await getTextWar()

    // the first index of the response from the Google Vision api is a batch string of all text 
    text = text.warNames.shift()

    // removes all special characters from the response
    text = text.replace(/\W/g, "")
    
    // removes the special characters from the alliance name then regexes them out
    // the /O-/ part is because the api sometimes returns Os in between the usernames and the alliance name
    name = name.replace(/\W/g, "")
    console.log(name)
    let alliance = new RegExp(name, "g")
    text = text.replace(alliance, "-").replace(/O-/g, "-")

    // splitting the names into an array for later use for matching with other data
    text = text.split("-")
    console.log(text)
}

//createNames("Allspark X-Force")

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