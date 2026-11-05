enum keys {
    Player,
    Barrel,
    Projectile
}

const K = Object.fromEntries(
    Object.keys(keys).map(k => [k, String(keys[k])])
) as Record<keyof typeof keys, string>;

export default K;
