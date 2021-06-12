import { Message } from 'discord.js';
import { createEmbed } from '../helpers';
import { getMatches, getTotalMatchCount, getUsers } from '../data-manager';
import { updateBotStatus } from '../utils';

export = {
    name: 'stats',
    description: 'Toon mijn statistieken',
    execute(message: Message) {
        const embed = createEmbed(
            'Statistieken',
            '\u200b',
            {
                name: 'Totaal aantal gebruikers',
                value: getUsers().length.toString(),
            },
            {
                name: 'Totaal aantal gemaakte ontmoetingen',
                value: getTotalMatchCount().toString(),
            },
            {
                name: 'Aantal mensen die je nog kunt ontmoeten',
                value: (getUsers().length - getMatches(message.author.id).length).toString(),
            }
        );
        updateBotStatus(message.client);
        embed.setFooter(`Data van ${new Date().toLocaleString('nl-NL')}`);
        return message.author.send(embed);
    },
};
