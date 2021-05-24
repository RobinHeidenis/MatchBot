import { Client, Collection, Message } from 'discord.js';

interface Command {
    name: string;
    description: string;
    execute: (message: Message, args?: string[]) => void | Promise<void>;
}

interface BotClient extends Client {
    commands: Collection<string, Command>;
}

interface UserData {
    id: string;
    categories?: number[];
    interests?: string;
    topics?: string;
}

type Match = [userOne: string, userTwo: string];

interface MatchInfo {
    user: string;
    date: Date;
}
