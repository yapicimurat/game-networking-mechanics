import { Player } from "./Player.js"

export type GameState = {
    players: Map<string, Player>,
}