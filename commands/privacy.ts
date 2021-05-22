import { Message } from 'discord.js';
import { createEmbed } from '../helpers';

export = {
    name: 'privacy',
    description: 'Toon mijn privacy policy',
    execute(message: Message) {
        // TODO: Translate to Dutch
        const embed = createEmbed('Privacy Policy', 'I need to collect the following information to function:', {
            name: 'Preferences',
            value: 'A reason as to why I need this',
        });

        return message.author.send(embed);
    },
};
