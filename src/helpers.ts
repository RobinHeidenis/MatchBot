import { Message, MessageEmbed } from 'discord.js';

const categories: { [key: number]: string } = {
    1: 'Iemand om mee te gamen',
    2: 'Gewoon gezellig praten',
    3: 'Muziek luisteren of maken',
};

interface RegistrationQuestion {
    question: string;
    dataKey?: string;
    answers?: string[];
}

export const questions: RegistrationQuestion[] = [
    {
        question: 'Waar zoek je momenteel naar?',
        answers: Object.values(categories),
    },
    { question: 'Wat zijn je interesses?', dataKey: 'interests' },
    { question: 'Waarover praat jij het liefst?', dataKey: 'topics' },
];

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
