require('dotenv').config();
import * as fs from 'fs';
import { BotClient } from './types';
const Discord = require('discord.js');
const client = new Discord.Client() as BotClient;
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('src/commands').filter((file) => file.endsWith('.ts'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
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
