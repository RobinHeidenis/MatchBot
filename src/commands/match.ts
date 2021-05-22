import { Message } from 'discord.js';
import { getUser, getUsers, UserData, userExists } from '../user-manager';
import { sleep } from '../utils';
import { categories, promptRegistration } from '../helpers';

export = {
    name: 'match',
    description: 'Zoek nieuwe mensen om te leren kennen',
    execute(message: Message) {
        return findMatch(message);
    },
};

async function findMatch(message: Message) {
    if (!userExists(message.author)) {
        return await promptRegistration(message);
    }
    const user = getUser(message.author.id)!;

    const users = getUsers().filter(({ id }) => id !== message.author.id);
    if (!users.length) {
        return await message.reply('Ik heb niemand in mijn lijst met mensen staan 😭.');
    }

    const sentMsg = await message.author.send('Bezig met zoeken...');
    await sleep(1500); // fake delay

    const match = matchUser(user, users);
    if (!match) return await sentMsg.edit('Ik heb helaas geen match voor je kunnen vinden ☹');

    await sentMsg.edit(
        `Match gevonden! Jij en <@${
            match.id
        }> zijn een goede match voor elkaar! Jullie hebben beide ${match.matchingCategories
            .map((id) => `\`${categories[id]}\``)
            .join(' en ')} geselecteerd als categorie!.\nStuur ze een bericht :)`
    );

    const matchedUser = message.client.users.cache.get(match.id)!;
    await matchedUser.send(
        `Je bent gematcht met <@${user.id}>!\nHun hobbies zijn \`${user.hobbies}\` en ze vinden het leuk om te praten over \`${user.topics}\``
    );
}

/** Calculates the amount of matching categories for each user and sorts them descending
 * @returns The user with the highest amount of matching categories */
function matchUser({ categories }: UserData, userPool: UserData[]): UserData & { matchingCategories: number[] } {
    const matches = userPool
        .map((potentialMatch) => ({
            ...potentialMatch,
            matchingCategories: categories!.filter((el) => potentialMatch.categories?.includes(el)),
        }))
        .sort((a, b) => b.matchingCategories.length - a.matchingCategories.length);
    // TODO: if this user profile has already been suggested, ignore it and pick the next best.
    return matches[0];
}
