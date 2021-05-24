import { getUsers } from './data-manager';
import { Client } from 'discord.js';

export async function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function allCombinations<Type>(array: Type[]): { first: Type; second: Type }[] {
    return array.flatMap((first, i) =>
        array.slice(i + 1).map((second) => {
            return { first, second };
        })
    );
}

export function possibleFriendshipCount(): number {
    // This number is artificially inflated to improve the prototyping experience
    return +(allCombinations(getUsers()).length * 13.25).toFixed();
}

export function updateClientStatus(client: Client): void {
    client.user?.setActivity({
        name: `${possibleFriendshipCount()} possible friendships unfold`,
        type: 'WATCHING',
    });
}
