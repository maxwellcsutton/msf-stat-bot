const vision = require('@google-cloud/vision');
const fs = require("fs")
const fsPromises = fs.promises
const creds = fs.readFileSync("./mdtGoogleApiCreds.json")


const projectId = JSON.parse(creds).project_id
const keyFilename = "./mdtGoogleApiCreds.json"

// Creates a client
const client = new vision.ImageAnnotatorClient({projectId, keyFilename});

const warFileName = "./image1.png";

// Performs text detection on the local file

async function getTextWar(){
    const [result] = await client.textDetection(warFileName);
    const detections = result.textAnnotations;
    let descArray = []
    detections.forEach((e)=>{
        let data = e.description
        descArray.push(data)
        
    })
    fsPromises.writeFile("./rawDataText.txt", descArray)
    descArray.shift()
    return descArray
}

async function writeFileWar(name){
    // initiates the data array for username and damage to be added later
    let data = []

    // calls the google api
    let text = await getTextWar()

    // creates a cleaned array out of the alliance name
    if (name.includes(" ")){
        name = name.split(" ")
        name = name.map(x => x.replace(/\W/g, ""))
    }
    if (Array.isArray(name) === false){
        name = [name]
    }
    
    // removes special characters from the data
    text = text.map(x => x.replace(/\W/gi, ""))

    for (let i = text.length - 1; i >= 0; i--){
        
        // removes extraneous characters
        if (text[i].length <= 1 || text[i] === "ME"){
            text.splice(i, 1)
        }

        // removes the alliance name from the screenshot
        name.forEach((word)=>{
            if (text[i] === word){
                text.splice(i, 1)
            }
        })
    }

    // name.forEach((word)=>{
    //     let regex = new RegExp(word, "g")
    //     text = text.map(x => x.replace(regex))
    // })

    // fixes names with spaces in them

    let regAbc = new RegExp(/[a-zA-Z]/, "")
    let filtered = {}
    
    text = text.map((elem, index) => {
        if (regAbc.test(elem.charAt(0)) && regAbc.test(text[index+1].charAt(0))){
            filtered[index+1] = ''
            return `${elem}${text[index+1]}`
        }
        return elem
    }).filter((elem,idx) => {
         if(typeof filtered[idx] === "undefined"){
                return elem
          }
    })

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
        fsPromises.writeFile("./outputWarText.csv", data)
        console.log("**War CSV Updated**")
    } catch (error) {
        console.log(error)
    }
     
}

writeFileWar("Allspark X-Force") // add ss type as a param