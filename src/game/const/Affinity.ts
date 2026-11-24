type AffinityRow = { type: string; color: `#${string}`};

export const AFFINITIES = [
    { type: 'Anime',   color: '#ff00ff' },
    { type: 'Base',    color: '#ffff00' },
    { type: 'Realism', color: '#00ff00' },
] as const satisfies readonly AffinityRow[]; //marked red in IDE unknown "satisfies"

type Indices<T extends readonly unknown[]> =
    Exclude<keyof T, keyof any[]> extends `${infer N extends number}`?
        N :
        never;

export type TAffinity = Indices<typeof AFFINITIES> //0 1 2

export const Affinity = Object.fromEntries(  // enum {Anime:0, etc}
    AFFINITIES.map((a,index) => [a.type, index])
) as { [K in (typeof AFFINITIES[number]['type'])]: TAffinity };
