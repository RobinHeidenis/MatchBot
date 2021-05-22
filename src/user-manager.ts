import * as fs from 'fs';
import { User } from 'discord.js';
import { UserData } from './types';

interface Data {
    users: UserData[];
}

export function addUser(user: UserData) {
    const data = readUsers();
    if (data.users.find(({ id }) => id === user.id)) return;

    data.users.push(user);
    fs.writeFileSync('./users.json', JSON.stringify(data, undefined, 4));
}

export function updateUser(userToUpdate: UserData) {
    const user = cleanseUser(userToUpdate);
    if (!userExists(user)) {
        return addUser(user);
    }
    const data = readUsers();
    data.users = data.users.filter(({ id }) => id !== user.id);
    data.users.push(user);
    fs.writeFileSync('./users.json', JSON.stringify(data, undefined, 4));
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

function readUsers(): Data {
    const file = fs.readFileSync('./users.json', 'utf8');
    return JSON.parse(file.toString()) as Data;
}

export function getUsers(): UserData[] {
    return readUsers().users;
}

export function getUser(userId: string): UserData | undefined {
    return readUsers().users.find((user) => user.id === userId);
}

export function userExists({ id }: User | UserData): boolean {
    const user = getUser(id);
    return user !== undefined;
}
