import { Client, MessageAttachment } from "discord.js"
import config from "./config.js"
import App from "./statReader.js"

const discord = new Client()
const app = new App()
const prefix = "!"

discord.login(config.BOT_TOKEN)

discord.on("message", async function(message) {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "war") {
        //upload the file then pass to jimp function
        /*
        TODO:
        1. make bot read the image
        2. upload the image to gcs
        3. download the image
        4. pass the image into the jimp function
        5. add image as a param to every function and add if blocks to check if the param exists so it can run locally if its not run by the bot
        */
        let upload = message.attachments.array()[0].url
        message.reply(`I'm processing your request.  Please stand by.`)
        let csv = await app.runWarApp(upload)
        let timeTaken = Date.now() - message.createdTimestamp
        message.reply(`I've processed your request in ${timeTaken/1000} seconds.  CSV output is attached.`)
        const attachment = new MessageAttachment(csv)
        message.reply(attachment)
    }
})