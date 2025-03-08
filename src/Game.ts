import { GameState } from "./types/GameState.js";
import { Player } from "./types/Player.js";
import { SnapShot } from "./types/SnapShot.js";
import { Input } from "./types/Input.js";
import Movement from "./Movement.js";
import { Position } from "./types/Position.js";

export default class Game {
    public tickCounter: number;
    public gameState: GameState;
    public snapshotHistory: Map<number, SnapShot>;
    public inputQueue: Input[];
    
    constructor() {
        this.gameState = {
            players: new Map<string, Player>()
        } as GameState;
        this.snapshotHistory = new Map();
        this.tickCounter = 1;
        this.inputQueue = [];
    }

    addInputToQueue(input: Input): void {
        if(input?.playerSocketId && this.inputQueue && Array.isArray(this.inputQueue)) {
            if(this.checkUserIsExist(input?.playerSocketId)) {
                this.inputQueue.push(input);
            } else {
                console.log("User could not be found with the " + input?.playerSocketId);
            }
        }
    }

    checkUserIsExist(socketId: string): boolean {
        if(this.gameState && this.gameState.players) {
            const currentPlayers: Map<string, Player> = this.gameState.players;
            if(currentPlayers instanceof Map && currentPlayers.get(socketId)) {
                return true;
            }
        }
        return false;
    }

    tick() {
        this.increaseTickCount();
    }

    calculateNewGameState() {
        /*
            inputQueue: Input[];
            gameState: GameState;
            snapshotHistory: Map<number, SnapShot>;
        */
        //runs for every tick
        const startTimestamp: number = Date.now();

        if(this.inputQueue && Array.isArray(this.inputQueue)) {
            const inputQueueSize = this.inputQueue.length;
            for(let i = 0; i < inputQueueSize; i++) {
                const input: Input = this.inputQueue[i] as Input;
                const player: Player = this.gameState.players.get(input.playerSocketId) as Player;
                const movement: Movement = new Movement(input, player);
                this.updatePlayerPosition(input.playerSocketId, movement.calculatePosition(player, input));
            }
        }
    }

    updatePlayerPosition(socketId: string, position: Position) {
        if(this.checkUserIsExist(socketId)) {
            const player = this.gameState.players.get(socketId);
            if(player) {
                player.position = position;
            }
        }
    }



    increaseTickCount() {
        this.tickCounter = this.tickCounter + 1;
    }
}