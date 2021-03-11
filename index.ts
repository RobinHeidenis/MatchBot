const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./conf.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
    if (msg.content === 'profile') {
        //TODO: fetch user profile from db, reply it to the user.
        //TODO: if the user doesn't have a profile yet, ask to set it up.
        msg.reply('This feature has not been implemented yet. This would normally show your profile');
    }
    if (msg.content === 'match') {
        //TODO: fetch user profile from db, compare it to other profiles, return the best one's username to the user.
        //TODO: if this user profile has already been suggested, ignore it and pick the next best.
        //TODO: if the user doesn't have a profile yet, ask to set it up.
        msg.reply('This feature has not been implemented yet. This would normally send you a discord users tag');
    }
    if (msg.content === 'setup') {
        //TODO: send questions one by one, save the answer to the questions in the db.
        //TODO: once finished, ask the user if they want to find a match now.
        msg.reply('This feature has not been implemented yet. This would normally ask you questions to set up your profile');
    }
    if (msg.content === 'report') {
        //TODO: ask what the tag of the user is.
        //TODO: find that user, if exists add the reporter and reported to db.
        msg.reply('This feature has not been implemented yet. This would normally ask you who you want to report');
    }
});

client.login(config.token);
