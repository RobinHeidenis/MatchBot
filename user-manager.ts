import * as fs from 'fs';

interface Data {
    users: UserData[];
}

export interface UserData {
    id: string;
    categories?: number[];
    hobbies?: string;
    topics?: string;
}

export function addUser(user: UserData) {
    const data = readUsers();
    if (data.users.find(({ id }) => id === user.id)) return;

    data.users.push(user);
    fs.writeFileSync('./users.json', JSON.stringify(data, undefined, 4));
}

function readUsers(): Data {
    const file = fs.readFileSync('./users.json', 'utf8');
    return JSON.parse(file.toString()) as Data;
}

export function getUsers(): UserData[] {
    return readUsers().users;
}

export function getUser(userId: string): UserData {
    return readUsers().users.find((user) => user.id === userId);
}
