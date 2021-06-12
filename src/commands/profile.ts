import { Message } from 'discord.js';
import { categories, createEmbed, promptRegistration } from '../helpers';
import { getMatches, getUser, userExists } from '../data-manager';

export = {
    name: 'profile',
    description: 'Toon jouw profiel',
    async execute(message: Message) {
        if (!userExists(message.author.id)) {
            return await promptRegistration(message);
        }
        const user = getUser(message.author.id)!;

        const matchCount = getMatches(user.id).length;
        const embed = createEmbed(
            'Jouw profiel',
            'De informatie die je tijdens je registratie hebt ingevoerd.',
            {
                name: 'Categorieën',
                value: user.categories?.map((categoryId) => categories[categoryId]).join(', ') ?? '\u200b',
            },
            {
                name: 'Interesses',
                value: user.interests ?? '\u200b',
            },
            {
                name: 'Onderwerpen waar je graag over praat',
                value: user.topics ?? '\u200b',
            },
            {
                name: 'Ontmoetingen',
                value:
                    matchCount > 0
                        ? `Je hebt ${matchCount} ${matchCount === 1 ? 'persoon' : 'mensen'} leren kennen`
                        : 'Je hebt nog niemand ontmoet',
            }
        );
        return message.author.send({ embeds: [embed] });
    },
};
