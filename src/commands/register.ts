import {
    CommandInteraction,
    Interaction,
    MessageEmbed,
    MessageReaction,
    User,
    Client,
    MessageActionRow,
    MessageButton,
} from 'discord.js';
import { addUser, userExists } from '../data-manager';
import { questions } from '../helpers';
import { UserData } from '../types';
import { updateBotStatus } from '../utils';

const multipleChoiceReactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];

export = {
    name: 'register',
    description: 'Maak een nieuw profiel aan. Op basis van dit profiel kan ik nieuwe mensen voor je zoeken.',
    async execute(interaction: CommandInteraction) {
        if (userExists(interaction.user.id)) {
            return interaction.reply({
                ephemeral: true,
                content: 'Je bent al geregistreerd. Gebruik `!match` om te beginnen met nieuwe mensen ontmoeten!',
            });
        }
        const row = new MessageActionRow().addComponents(
            new MessageButton({ customID: 'understoodIntro', label: 'Ik heb de tekst gelezen', style: 'PRIMARY' })
        );

        await interaction.reply({
            ephemeral: true,
            content: `Hi! Ik ben ${interaction.client.user?.username} en ik ben hier om jou met een andere persoon te matchen die dezelfde interesses als jij heeft.\nGebruik \`!privacy\` als je meer wilt weten over de gegevens die ik verzamel en wat ik daarmee doe. Je kan \`!help\` typen om de hulppagina te zien.\nMisbruik van deze bot of van mensen die je via deze bot ontmoet, wordt niet getolereerd en je kan volledig verbannen worden van het gebruik van deze bot. Je kan \`!report gebruiker#1234\` typen om een specifieke gebruiker te rapporteren. Veel plezier!\n\nJe krijgt straks ${questions.length} vragen voorgelegd. Zodra je op de knop klikt, begint de registratie.`,
            components: [row],
        });
    },
    begin,
};

async function begin(interaction: Interaction) {
    return await sendQuestion(interaction.user, interaction.client, { id: interaction.user.id, categories: [] });
}

async function sendQuestion(user: User, client: Client, userData: UserData, questionNumber = 0) {
    if (questionNumber > questions.length - 1) return await finishRegistration(user, client, userData);

    const { question, dataKey, answers } = questions[questionNumber];

    const embed = new MessageEmbed()
        .setTitle(`Vraag ${questionNumber + 1}/${questions.length}`)
        .setDescription(question);
    if (answers) {
        answers.forEach((answer, index) => {
            embed.addField(`${multipleChoiceReactions[index]} ${answer}`, '\u200B');
        });
        embed.setFooter('Klik op ✅ om je antwoorden op te slaan.');
    } else {
        embed.setFooter('Dit is een open vraag, druk op enter om je antwoord op te slaan.');
    }
    const sentMsg = await user.send({ embeds: [embed] });

    if (answers) {
        const collector = sentMsg.createReactionCollector(
            ({ emoji }: MessageReaction, user: User) =>
                !user.bot && [...multipleChoiceReactions, '✅'].includes(emoji.name!)
        );

        collector.on('collect', async (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            if (reaction.emoji.name === '✅') {
                if (collector.collected.filter(({ emoji }) => emoji.name !== '✅').size) {
                    collector.stop();
                } else {
                    await user.send('Selecteer minstens één antwoord en probeer het opnieuw');
                }
            }
        });

        collector.on('end', (collected) => {
            console.log(`Collected ${collected.size} items`);
            userData.categories = collected
                .filter(({ emoji }: MessageReaction) => emoji.name !== '✅')
                .map(({ emoji }: MessageReaction) => multipleChoiceReactions.indexOf(emoji.name!) + 1);
            sendQuestion(user, client, userData, questionNumber + 1);
        });

        await Promise.all(
            multipleChoiceReactions.slice(0, answers.length).map(async (emoji) => await sentMsg.react(emoji))
        );
        await sentMsg.react('✅');
    } else {
        await sentMsg.channel
            .awaitMessages((response) => response.author.id === user.id && response.content.length > 0, {
                max: 1,
            })
            .then((collected) => {
                // @ts-ignore
                userData[dataKey] = collected.first().content;
                sendQuestion(user, client, userData, questionNumber + 1);
            });
    }
}

async function finishRegistration(user: User, client: Client, userData: UserData) {
    addUser(userData);
    updateBotStatus(client);

    return await user.send(
        'Je registratie is voltooid. Vanaf nu heb je de mogelijkheid om via mij nieuwe mensen te ontmoeten. Gebruik `!match` om een match te vinden.'
    );
}
