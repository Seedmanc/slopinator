enum keys {
    Player,
    Barrel,
    Projectile,
    Website
}

const K = Object.fromEntries(
    Object.keys(keys).map(k => [k, String(keys[k])])
) as Record<keyof typeof keys, string>;

export default K;

export enum Affinity {
    Anime,
    Base,
    Realism
}
