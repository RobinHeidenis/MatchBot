import { Client, Collection, Message } from 'discord.js';

interface Command {
    name: string;
    description: string;
    execute: (message: Message, args?: string[]) => void | Promise<void>;
}

interface BotClient extends Client {
    commands: Collection<string, Command>;
}