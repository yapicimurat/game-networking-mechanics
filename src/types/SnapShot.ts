import { Player } from "./Player.js";
import { GameState } from "./GameState.js";

export type SnapShot = {
    uuid: string;
    gameState: GameState;
    timestamp: number; //Snapshot hangi zaman da calculate edildiyse, timestamp degeri
}