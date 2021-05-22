import { Message, MessageEmbed, MessageReaction, User } from 'discord.js';
import { getUsers, addUser, UserData } from './user-manager';
import { sleep } from './utils';

async function startRegistration(message: Message) {
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
            answers: ['Iemand om mee te gamen', 'Gewoon gezellig praten', 'Muziek luisteren/maken'],
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
    let user = message.content.slice(7);
    if (user) {
        //TODO: add the reporter and reported to db.
        return await message.reply(`Je hebt ${user} succesvol gerapporteerd.`);
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
    //TODO: compare user to other profiles, return the best one's username to the user.
    //TODO: if this user profile has already been suggested, ignore it and pick the next best.
    //TODO: if the user doesn't have a profile yet, ask to set it up.
    const matches = getUsers().filter(({ id }) => id !== message.author.id);
    if (!matches.length) {
        return await message.reply('Ik heb niemand in mijn lijst met mensen staan 😭.');
    }

    const match = matches[Math.floor(Math.random() * matches.length)];

    const sentMsg = await message.author.send('Bezig met zoeken..');
    await sleep(1500);
    return await sentMsg.edit(
        `Match gevonden! Jij en <@${match}> zijn een goede match voor elkaar! Stuur ze een bericht :)`
    );
}

async function privacy(message: Message) {
    // TODO: Translate to Dutch
    const embed = createEmbed('Privacy Policy', 'I need to collect the following information to function:', {
        name: 'Preferences',
        value: 'A reason as to why I need this',
    });

    return await message.author.send(embed);
}

export { privacy, findMatch, report, startRegistration };
