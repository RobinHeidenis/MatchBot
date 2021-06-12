import { Message, MessageEmbed } from 'discord.js';
import { getMatches } from '../data-manager';
import { createEmbed } from '../helpers';

export = {
    name: 'matches',
    description: 'Laat alle mensen zien die je hebt ontmoet',
    execute(message: Message) {
        const matches = getMatches(message.author.id)
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 25); // don't exceed the 25 embed field limit
        const embed = createEmbed(
            'Jouw ontmoetingen',
            'Dit zijn de mensen en de tijden waarop jij ze hebt ontmoet:',
            ...matches.map((matchInfo) => ({
                name: matchInfo.date.toLocaleString('nl-NL'),
                value: `<@${matchInfo.user}>`,
            }))
        );
        return message.author.send({ embeds: [embed] });
    },
};
