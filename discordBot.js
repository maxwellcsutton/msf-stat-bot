import Discord from "discord.js"
import config from "./config.js"
import Output from "./output.js"

const discord = new Discord.Client()
const output = new Output()
const prefix = "!"

discord.login(config.BOT_TOKEN)

discord.on("message", function(message) {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    }

    if (command === "war") {
        //upload the file then pass to jimp function
        /*
        TODO:
        1. make bot read the image
        2. upload the image to gcs
        3. download the image
        4. pass the image into the jimp function
        */
        let csv = await output.outputData()
        message.reply(`CSV Output: ${csv}`)
    }
})