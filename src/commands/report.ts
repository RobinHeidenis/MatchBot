import { Message } from 'discord.js';
export = {
    name: 'report',
    description: 'Rapporteer een gebruiker.',
    execute(message: Message, args: string[]) {
        let userToReport = args[0];
        if (userToReport) {
            //TODO: add the reporter and reported to db.
            return message.reply(`Je hebt ${userToReport} succesvol gerapporteerd.`);
        } else {
            return message.reply('You did not mention the user to report');
        }
        return message.reply(
            'This feature has not been implemented yet. This would normally report the person you have tagged'
        );
    },
};
