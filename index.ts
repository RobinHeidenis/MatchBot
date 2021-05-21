import { findMatch, privacy, report, startRegistration } from './match-functions';

require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

client.login(process.env.TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args: string[] = msg.content.slice(prefix.length).trim().split(/ +/);
    const command: string = args.shift().toLowerCase();

    if (command === 'ping') {
        return await msg.reply('Pong!');
    }

    if (command === 'register') {
        return await startRegistration(msg);
    }

    if (command === 'match') {
        return await findMatch(msg);
    }

    if (command === 'privacy') {
        return await privacy(msg);
    }

    if (command === 'profile') {
        //TODO: fetch user profile from db, reply it to the user.
        //TODO: if the user doesn't have a profile yet, ask to set it up.
        return msg.reply('This feature has not been implemented yet. This would normally show your profile');
    }

    if (command.startsWith('report')) {
        return await report(msg);
    }
});
