import { Message } from 'discord.js';
import { categories, createEmbed, promptRegistration } from '../helpers';
import { getUser, userExists } from '../data-manager';

export = {
    name: 'profile',
    description: 'Toon jouw profiel',
    async execute(message: Message) {
        if (!userExists(message.author)) {
            return await promptRegistration(message);
        }
        const user = getUser(message.author.id)!;

        const embed = createEmbed(
            'Jouw profiel',
            'De informatie die je tijdens je registratie hebt ingevoerd.',
            {
                name: 'Categorieën',
                value: user.categories?.map((categoryId) => categories[categoryId]).join(', ') ?? '\u200b',
            },
            {
                name: 'Hobbies',
                value: user.hobbies ?? '\u200b',
            },
            {
                name: 'Onderwerpen waar je graag over praat',
                value: user.topics ?? '\u200b',
            },
            {
                name: 'Ontmoetingen',
                value: `Je hebt ${user.matches.length} mensen leren kennen`,
            }
        );
        return message.author.send(embed);
    },
};
