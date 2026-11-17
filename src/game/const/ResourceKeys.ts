enum keys {
    Player,
    Barrel,
    Projectile,
    Website
}

const K = Object.fromEntries(
    Object.keys(keys).map(k => [k, String(keys[k])])
) as Record<keyof typeof keys, keyof typeof keys>;

export default K;
