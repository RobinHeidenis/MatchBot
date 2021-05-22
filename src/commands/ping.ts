import { Message } from 'discord.js';

export = {
    name: 'ping',
    description: 'Ping!',
    execute(message: Message) {
        return message.reply('Pong!');
    },
};
