import { Message, MessageEmbed, MessageReaction, User } from 'discord.js';
import { addUser, userExists } from '../data-manager';
import { categories } from '../helpers';
import { UserData } from '../types';

interface RegistrationQuestion {
    question: string;
    dataKey?: string;
    answers?: string[];
    timeLimit?: number;
}

export = {
    name: 'register',
    description: 'Maak een nieuw profiel aan. Op basis van dit profiel kan ik nieuwe mensen voor je zoeken.',
    execute(message: Message) {
        return startRegistration(message);
    },
};

async function startRegistration(message: Message) {
    if (userExists(message.author)) {
        return message.author.send(
            'Je bent al geregistreerd. Gebruik `!match` om te beginnen met nieuwe mensen ontmoeten!'
        );
    }
    await message.author.send(
        'Hi! ik ben LonelinessFighter en ik ben hier om jou met een andere persoon te matchen die dezelfde interesses als jij heeft.' +
            ' Gebruik `!privacy` als je meer wilt weten over de gegevens die ik verzamel en wat ik daarmee doe. Je kan `!help` typen om de hulppagina te zien.' +
            ' Misbruik van deze bot of van mensen die je via deze bot ontmoet, wordt niet getolereerd en je kan volledig verbannen worden van het gebruik van deze bot. Je kan `!report gebruiker#1234` typen om een specifieke gebruiker te rapporteren. Veel plezier!'
    );

    return await sendQuestion(message, { id: message.author.id, categories: [], matches: [] });
}

async function sendQuestion(message: Message, userData: UserData, questionNumber = 0) {
    // TODO: Increase time limit
    const questions: RegistrationQuestion[] = [
        {
            question: 'Waar zoek je momenteel naar?',
            answers: Object.values(categories),
            timeLimit: 15000,
        },
        { question: 'Wat zijn je hobbies?', dataKey: 'hobbies' },
        { question: 'Waarover praat jij het liefst?', dataKey: 'topics' },
    ];

    if (questionNumber > questions.length - 1) return await finishRegistration(message.author, userData);
    const { question, dataKey, answers, timeLimit } = questions[questionNumber];

    const embed = new MessageEmbed().setTitle('Een vraag voor jou').setDescription(question);
    if (answers) {
        answers.forEach((answer, index) => {
            embed.addField(`${index + 1} ${answer}`, '\u200B');
        });
        embed.addField(`Tijdslimiet: ${timeLimit! / 1000}s`, '\u200B');
    } else {
        embed.addField('Open vraag', '\u200B');
    }
    const sentMsg = await message.author.send(embed);

    if (answers) {
        const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];

        await Promise.all(reactions.slice(0, answers.length).map(async (emoji) => await sentMsg.react(emoji)));
        const collector = sentMsg.createReactionCollector(({ emoji }) => reactions.includes(emoji.name), {
            time: timeLimit,
        });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        });

        collector.on('end', (collected) => {
            console.log(`Collected ${collected.size} items`);
            userData.categories = collected.map(
                (reaction: MessageReaction) => reactions.indexOf(reaction.emoji.name) + 1
            );
            sendQuestion(message, userData, questionNumber + 1);
        });
    } else {
        await sentMsg.channel
            .awaitMessages((response) => response.content.length > 0, { max: 1 })
            .then((collected) => {
                // @ts-ignore
                userData[dataKey] = collected.first().content;
                sendQuestion(message, userData, questionNumber + 1);
            });
    }
}

async function finishRegistration(author: User, userData: UserData) {
    addUser(userData);
    return await author.send(
        'Je registratie is voltooid. Vanaf nu heb je de mogelijkheid om via mij nieuwe mensen te ontmoeten. Gebruik `!match` om een match te vinden.'
    );
}
