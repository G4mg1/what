// -------------------------------
// Required Packages
// -------------------------------
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import express from "express";

// -------------------------------
// Bot & Server Setup
// -------------------------------
const TOKEN = "MTQ1NjA0NDE4MzI0MzQ1NjU3NA.GArlTq.lXGPPOHP5OwRTVZffPL_DJj_Pw_Ti28SBesBbw"; // Your bot token
const ALLOWED_CHANNEL_ID = "1456062237822287972"; // Only allow commands in this channel
let latestMessage = "";

// Discord Client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Express Server
const app = express();
const PORT = 5000;

// -------------------------------
// Express Routes
// -------------------------------
app.get("/get_message", (req, res) => {
    res.json({ msg: latestMessage });
});

// Start Express server
app.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
});

// -------------------------------
// Discord Bot Events
// -------------------------------
client.once("ready", async () => {
    console.log(`Bot is ready. Logged in as ${client.user.tag}`);

    // Register slash command dynamically
    const commands = [
        {
            name: "runs",
            description: "Execute Code!",
            options: [
                {
                    name: "msg",
                    type: 3, // STRING type
                    description: "Your code to execute blud",
                    required: true,
                },
            ],
        },
    ];

    const rest = new REST({ version: "10" }).setToken(TOKEN);
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log("Slash command registered.");
    } catch (error) {
        console.error(error);
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "runs") {
        if (interaction.channelId !== ALLOWED_CHANNEL_ID) {
            await interaction.reply({
                content: "Hey Diddy Blud! Make sure to go to the Cmds channel to use the bot!",
                ephemeral: true,
            });
            return;
        }

        const msg = interaction.options.getString("msg");
        latestMessage = msg;

        await interaction.reply({
            content: `Executing your code: ${msg}`,
            ephemeral: true,
        });

        console.log(`Message from ${interaction.user.tag}: ${msg}`);
    }
});

// Login the bot
client.login(TOKEN);
