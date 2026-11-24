enum keys {
    Player,
    Barrel,
    Projectile,
    Website
}

const K = Object.fromEntries(
    Object.keys(keys).map(k => [k, String(keys[k])])
) as Record<keyof typeof keys, keyof typeof keys>; // because writing {Player: "player"} violates DRY

export default K;
