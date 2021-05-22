import { Message, MessageEmbed, MessageReaction, User } from 'discord.js';
import { getUsers, addUser, UserData, getUser, userExists } from './user-manager';
import { matchingElements, sleep } from './utils';

const categories = {
    1: 'Iemand om mee te gamen',
    2: 'Gewoon gezellig praten',
    3: 'Muziek luisteren/maken',
};

async function promptRegistration(message: Message) {
    return message.author.send(
        'Je moet je eerst registreren voordat je mensen kunt zoeken. Gebruik `!register` om te beginnen met jouw registratie.'
    );
}

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

    return await sendQuestion(message, { id: message.author.id, categories: [] });
}

async function sendQuestion(message: Message, userData: UserData, questionNumber = 0) {
    // TODO: Increase time limit
    const questions = [
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
        embed.addField(`Tijdslimiet: ${timeLimit / 1000}s`, '\u200B');
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

async function report(message: Message) {
    let userToReport = message.content.slice(7);
    if (userToReport) {
        //TODO: add the reporter and reported to db.
        return await message.reply(`Je hebt ${userToReport} succesvol gerapporteerd.`);
    } else {
        return await message.reply('You did not mention the user to report');
    }
    return await message.reply(
        'This feature has not been implemented yet. This would normally report the person you have tagged'
    );
}

function createEmbed(title: string, description: string, ...fields: { name: string; value: string }[]) {
    const embed = new MessageEmbed().setColor('BLUE').setTitle(title).setDescription(description);
    if (fields.length > 0) {
        embed.addFields(fields);
    }

    return embed;
}

async function findMatch(message: Message) {
    if (!userExists(message.author)) {
        return await promptRegistration(message);
    }
    const user = getUser(message.author.id);

    const users = getUsers().filter(({ id }) => id !== message.author.id);
    if (!users.length) {
        return await message.reply('Ik heb niemand in mijn lijst met mensen staan 😭.');
    }

    const sentMsg = await message.author.send('Bezig met zoeken...');
    await sleep(1500); // fake delay

    const match = matchUser(user, users);
    if (!match) return await sentMsg.edit('Ik heb helaas geen match voor je kunnen vinden ☹');

    await sentMsg.edit(
        `Match gevonden! Jij en <@${match.id}> zijn een goede match voor elkaar! Jullie hebben ${match.matchCount} dingen in common. Stuur ze een bericht :)`
    );

    // TODO: DM the match to let them know they should expect a message soon
}

/** Calculates the amount of matching categories for each user and sorts them descending
 * @returns The user with the highest amount of matching categories */
function matchUser({ categories }: UserData, userPool: UserData[]): UserData & { matchCount: number } {
    const matches = userPool
        .map((potentialMatch) => ({
            ...potentialMatch,
            matchCount: matchingElements(categories, potentialMatch.categories),
        }))
        .sort((a, b) => b.matchCount - a.matchCount);
    // TODO: if this user profile has already been suggested, ignore it and pick the next best.
    return matches[0];
}

async function privacy(message: Message) {
    // TODO: Translate to Dutch
    const embed = createEmbed('Privacy Policy', 'I need to collect the following information to function:', {
        name: 'Preferences',
        value: 'A reason as to why I need this',
    });

    return await message.author.send(embed);
}

async function profile(message: Message) {
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
}

export { privacy, findMatch, report, startRegistration, profile };
