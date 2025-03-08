interface ServerSettings {
    readonly SERVER_TICK_RATE_IN_MS: number;
}

export const SERVER_CONFIG: ServerSettings = {
    SERVER_TICK_RATE_IN_MS: 1000 / 40,
}