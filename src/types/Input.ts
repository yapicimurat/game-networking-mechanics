import { InputType } from "./InputType.js";
import { Movement } from "./Movement.js";

export type Input = {
    sequnceId: number;
    playerSocketId: string;
    type: InputType;
    timestamp: number;
    movement: Movement;
}