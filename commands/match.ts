import { Message } from 'discord.js';
import { getUser, getUsers, UserData, userExists } from '../user-manager';
import { matchingElements, sleep } from '../utils';
import { promptRegistration } from '../helpers';

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
