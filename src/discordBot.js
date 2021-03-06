import { Client, MessageAttachment } from "discord.js"
import dotenv from "dotenv"
import Auth from "./auth.js"
import App from "./statReader.js"

dotenv.config({ path: '../.env' })
const discord = new Client()
const prefix = "$"
const auth = new Auth()
auth.setEnvVars()
const app = new App()



discord.login(process.env.BOT_TOKEN)

discord.on("message", async function(message) {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return

    const commandBody = message.content.slice(prefix.length)
    const args = commandBody.split(' ')
    const command = args.shift().toLowerCase()

    if (command === "war") {
        try {
            // checks if the message has an attachment
            let msgAttachments = message.attachments.array()[0]
            if (!msgAttachments) {
                message.reply("Please add an image to your request.")
                return
            }
            // upload the file then pass to war app
            let upload = msgAttachments.url
            message.reply(`I'm processing your request.  Please stand by.`)
            let csv = await app.runWarApp(upload)
            let timeTaken = Date.now() - message.createdTimestamp
            message.reply(`I've processed your request in ${timeTaken/1000} seconds.  CSV output is attached.`)
            const attachment = new MessageAttachment(csv)
            message.reply(attachment)
        } catch (err) {
            if (err) {
                message.reply("I was not able to process your request.  Please make sure an image of the proper format was uploaded.  Only portrait mode images from war results are accepted.")
                return
            }
        }
    }
})