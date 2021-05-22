export async function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function matchingElements(a1: any[], a2: any[]): number {
    return a1.filter((v) => a2.includes(v)).length;
}
