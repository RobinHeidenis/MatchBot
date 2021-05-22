import { Message, MessageEmbed } from 'discord.js';

export const categories: { [key: number]: string } = {
    1: 'Iemand om mee te gamen',
    2: 'Gewoon gezellig praten',
    3: 'Muziek luisteren/maken',
};

export async function promptRegistration(message: Message) {
    return message.author.send(
        'Je moet je eerst registreren voordat je mensen kunt zoeken. Gebruik `!register` om te beginnen met jouw registratie.'
    );
}

export function createEmbed(title: string, description: string, ...fields: { name: string; value: string }[]) {
    const embed = new MessageEmbed().setColor('BLUE').setTitle(title).setDescription(description);
    if (fields.length > 0) {
        embed.addFields(fields);
    }

    return embed;
}
