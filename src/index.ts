require('dotenv').config();
import { Intents } from 'discord.js';
import * as fs from 'fs';
import { BotClient } from './types';
import { possibleFriendshipCount } from './utils';

const Discord = require('discord.js');
const client = new Discord.Client({
    presence: {
        activity: {
            name: `${possibleFriendshipCount()} possible friendships unfold`,
            type: 'WATCHING',
        },
    },
    intents: [Intents.ALL],
}) as BotClient;
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('src/commands').filter((file) => file.endsWith('.ts'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// blatant duplicate of command setup, too lazy to clean this up as these final changes are only for the research project
client.interactions = new Discord.Collection();
const interactionFiles = fs.readdirSync('src/interactions').filter((file) => file.endsWith('.ts'));
for (const file of interactionFiles) {
    const action = require(`./interactions/${file}`);
    client.interactions.set(action.name, action);
}

export const prefix = '!';

client.login(process.env.TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on('message', async (msg) => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (!command || !client.commands.has(command)) return;
    try {
        client.commands.get(command)?.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('er is iets fout gegaan.');
    }
});

client.on('interaction', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (!client.commands.has(interaction.commandName)) return;

    try {
        client.commands.get(interaction.commandName)?.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ ephemeral: true, content: 'er is iets fout gegaan.' });
    }
});

client.on('interaction', async (interaction) => {
    if (!interaction.isMessageComponent()) return;

    if (
        !client.interactions.has(interaction.customID) ||
        !client.interactions.some(({ name }) => name.startsWith(interaction.customID))
    )
        return;

    try {
        client.interactions.get(interaction.customID)?.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ ephemeral: true, content: 'er is iets fout gegaan.' });
    }
    return;
});
