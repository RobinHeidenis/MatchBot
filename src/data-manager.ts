import * as fs from 'fs';
import { User } from 'discord.js';
import { Match, UserData } from './types';

interface Data {
    users: UserData[];
    matches: { match: Match; date: number }[];
}

export function addUser(user: UserData) {
    const data = readData();
    if (data.users.find(({ id }) => id === user.id)) return;

    data.users.push(user);
    fs.writeFileSync('./users.json', JSON.stringify(data, undefined, 4));
}

export function updateUser(userToUpdate: UserData) {
    const user = cleanseUser(userToUpdate);
    if (!userExists(user)) {
        return addUser(user);
    }
    const data = readData();
    data.users = data.users.filter(({ id }) => id !== user.id);
    data.users.push(user);
    fs.writeFileSync('./users.json', JSON.stringify(data, undefined, 4));
}

export function addMatch(userOne: string, userTwo: string) {
    const data = readData();
    data.matches.push({
        match: [userOne, userTwo],
        date: Date.now(),
    });
    fs.writeFileSync('./users.json', JSON.stringify(data, undefined, 4));
}

/** Determines whether two users have already been matched
 * @returns true if a match between the two users exists, false otherwise
 */
export function matchExists(userOne: string, userTwo: string): boolean {
    const { matches } = readData();
    return matches.find(({ match }) => match.includes(userOne) && match.includes(userTwo)) !== undefined;
}

function cleanseUser(user: UserData): UserData {
    return {
        id: user.id,
        categories: user.categories,
        hobbies: user.hobbies,
        topics: user.topics,
        matches: user.matches,
    };
}

function readData(): Data {
    const file = fs.readFileSync('./users.json', 'utf8');
    return JSON.parse(file.toString()) as Data;
}

export function getUsers(): UserData[] {
    return readData().users;
}

export function getUser(userId: string): UserData | undefined {
    return readData().users.find((user) => user.id === userId);
}

export function userExists({ id }: User | UserData): boolean {
    const user = getUser(id);
    return user !== undefined;
}
