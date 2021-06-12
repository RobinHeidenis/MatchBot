import { Client, Collection, CommandInteraction, Message, MessageComponentInteraction } from 'discord.js';

interface Command {
    name: string;
    description: string;
    execute: (
        message?: Message | CommandInteraction | MessageComponentInteraction,
        args?: string[]
    ) => void | Promise<void>;
}

interface BotClient extends Client {
    commands: Collection<string, Command>;
    interactions: Collection<string, Command>;
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
