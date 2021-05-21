import * as fs from 'fs';

interface Data {
  users: string[];
}

export function addUser(user: string) {
  const data = readUsers();
  if (data.users.includes(user)) return;

  data.users.push(user);
  fs.writeFileSync('./users.json', JSON.stringify(data, undefined, 4));
}

function readUsers(): Data {
  const file = fs.readFileSync('./users.json', 'utf8');
  return JSON.parse(file.toString()) as Data;
}

export function getUsers(): string[] {
  return readUsers().users;
}
