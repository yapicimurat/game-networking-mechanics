
import { Position } from "./Position.js";
import { Input } from "./Input.js";
import { Movement } from "./Movement.js";

export type Player = {
    socketId: string;
    username: string;
    lastProcessedInput: Input;
    position: Position;
    oldPosition: Position;
    movement: Movement;
}