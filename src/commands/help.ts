import { Message } from 'discord.js';
import { prefix } from '../index';
import { BotClient } from '../types';

export = {
    name: 'help',
    description: 'Alle beschikbare commands',
    execute(message: Message, args: string[]) {
        const data = [];
        const { commands } = message.client as BotClient;
        if (!args.length) {
            data.push('Hier zijn al mijn commands:');
            data.push(commands.map((command) => command.name).join(', '));
            data.push(`\nJe kan \`${prefix}help [command]\` gebruiken om meer info over dat command te krijgen.`);

            return (
                message.author
                    // TODO: discord.js v13 removed support for send(data, { split: true }). This is a workaround, but it's broken :)
                    .send(data.join('\n'))
                    .then(() => {
                        if (message.channel.type === 'dm') return;
                        message.reply("Ik heb je ge-DM'd!");
                    })
                    .catch((error) => {
                        console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                        message.reply("ik kan niet in je DM's sliden... heb je ze uitstaan?");
                    })
            );
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name);
        if (!command) return;
        data.push(`**Naam:** ${command.name}`);
        data.push(`**Beschrijving:** ${command.description}`);

        // TODO: discord.js v13 removed support for send(data, { split: true }). This is a workaround, but it's broken :)
        return message.channel.send(data.join('\n'));
    },
};
