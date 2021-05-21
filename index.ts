require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

client.login(process.env.TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args: string[] = msg.content.slice(prefix.length).trim().split(/ +/);
    const command: string = args.shift().toLowerCase();

    if (command === 'ping') {
        msg.reply('Pong!');
    }
    if (command === 'profile') {
        //TODO: fetch user profile from db, reply it to the user.
        //TODO: if the user doesn't have a profile yet, ask to set it up.
        msg.reply('This feature has not been implemented yet. This would normally show your profile');
    }
    if (command === 'match') {
        //TODO: fetch user profile from db, compare it to other profiles, return the best one's username to the user.
        //TODO: if this user profile has already been suggested, ignore it and pick the next best.
        //TODO: if the user doesn't have a profile yet, ask to set it up.
        msg.reply('This feature has not been implemented yet. This would normally send you a discord users tag');
    }
    if (command === 'setup') {
        //TODO: send questions one by one, save the answer to the questions in the db.
        //TODO: once finished, ask the user if they want to find a match now.
        msg.reply('This feature has not been implemented yet. This would normally ask you questions to set up your profile');
    }
    if (command.startsWith('report')) {
        let user = msg.content.slice(7);
        if(user) {
            //TODO: add the reporter and reported to db.
            msg.reply('Reported ' + user);
        } else {
            msg.reply('You did not mention the user to report');
        }
        msg.reply('This feature has not been implemented yet. This would normally report the person you have tagged');
    }
});


