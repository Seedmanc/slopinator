enum keys {
    Player,
    Barrel
}

const K = Object.fromEntries(
    Object.keys(keys).map(k => [k, String((keys as any)[k])])
) as Record<keyof typeof keys, string>;

export default K;
