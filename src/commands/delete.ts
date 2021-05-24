import { Message } from 'discord.js';
import { deleteUser, userExists } from '../data-manager';
import { updateClientStatus } from '../utils';

export = {
    name: 'delete',
    description: 'Verwijder jouw profiel',
    async execute(message: Message) {
        if (!userExists(message.author)) {
            return await message.author.send('Je hebt geen profiel.');
        }
        const sentMsg = await message.author.send('Weet je zeker dat je je account wilt verwijderen?');
        const options = ['❌', '✅'];
        await Promise.all(options.map(async (emoji) => await sentMsg.react(emoji)));
        const collector = sentMsg.createReactionCollector(({ emoji }) => ['✅', '❌'].includes(emoji.name), {
            time: 30000,
        });

        collector.on('collect', () => collector.stop());

        collector.on('end', (collected) => {
            console.log(`Collected ${collected.size} items`);
            const choice = collected.first()?.emoji.name;
            if (!choice) {
                return message.author.send('Ik heb na 30s geen antwoord gekregen. Je profiel is niet verwijderd.');
            }

            if (choice === '❌') {
                return message.author.send('Je profiel is niet verwijderd.');
            } else if (choice === '✅') {
                deleteUser(message.author.id);
                updateClientStatus(message.client);
                return message.author.send('Ik heb je profiel succesvol verwijderd.');
            }
        });
    },
};
