import { Message } from 'discord.js';
import { categories, createEmbed, promptRegistration } from '../helpers';
import { getUser, userExists } from '../user-manager';

export = {
    name: 'profile',
    description: 'Toon jouw profiel',
    async execute(message: Message) {
        if (!userExists(message.author)) {
            return await promptRegistration(message);
        }
        const user = getUser(message.author.id);

        const embed = createEmbed(
            'Jouw profiel',
            'De informatie die je tijdens je registratie hebt ingevoerd.',
            {
                name: 'Categorieën',
                value: user.categories.map((categoryId) => categories[categoryId]).join(', '),
            },
            {
                name: 'Hobbies',
                value: user.hobbies,
            },
            {
                name: 'Onderwerpen waar je graag over praat',
                value: user.topics,
            }
        );
        return message.author.send(embed);
    },
};
