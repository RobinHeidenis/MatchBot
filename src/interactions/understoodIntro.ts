import { MessageActionRow, MessageButton, MessageComponentInteraction } from 'discord.js';
import { questions } from '../helpers';
import registration from '../commands/register';

export = {
    name: 'understoodIntro',
    async execute(interaction: MessageComponentInteraction) {
        await interaction.update({
            content: `Hi! Ik ben ${
                interaction.client.user?.username
            } en ik ben hier om jou met een andere persoon te matchen die dezelfde interesses als jij heeft.\nGebruik \`!privacy\` als je meer wilt weten over de gegevens die ik verzamel en wat ik daarmee doe. Je kan \`!help\` typen om de hulppagina te zien.\nMisbruik van deze bot of van mensen die je via deze bot ontmoet, wordt niet getolereerd en je kan volledig verbannen worden van het gebruik van deze bot. Je kan \`!report gebruiker#1234\` typen om een specifieke gebruiker te rapporteren. Veel plezier!\n\nJe krijgt straks ${
                questions.length
            } vragen voorgelegd.${
                interaction.channel?.type !== 'dm'
                    ? '\n\n**Ik heb je een DM gestuurd. Daar kan je je registratie beginnen.**'
                    : ''
            }`,
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton({
                        customID: 'startRegistration',
                        label: 'Je bent akkoord gegaan',
                        style: 'SUCCESS',
                        disabled: true,
                    })
                ),
            ],
        });

        await registration.begin(interaction);
    },
};
