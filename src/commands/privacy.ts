import { Message } from 'discord.js';
import { createEmbed } from '../helpers';

export = {
    name: 'privacy',
    description: 'Toon mijn privacy policy',
    execute(message: Message) {
        // TODO: Translate to Dutch
        const embed = createEmbed(
            'Privacy Policy',
            'Ik heb de volgende informatie van je nodig om goed te functioneren:',
            {
                name: 'Discord ID',
                value: 'Om je te kunnen matchen met andere mensen slaan wij je Discord ID op. Dit is een unieke identifier waarmee ik een @user#1234 tag kan maken.',
            },
            {
                name: 'Hobbies',
                value: 'Dit is het antwoord op de registratievraag over wat je hobbies zijn. Dit wordt gedeeld met de mensen waar ik je mee match.',
            },
            {
                name: 'Onderwerpen',
                value: 'Dit is het antwoord op de registratievraag over waar je graag over praat. Dit wordt gedeeld met de mensen waar ik je mee match.',
            }
        );

        return message.author.send(embed);
    },
};
