import {SERVER_CONFIG} from "./constants/gameConstants.js";
import Game from "./Game.js";
import { Movement } from "./types/Movement.js";

const game = new Game();
const movement: Movement = {
    dx: 1,
    dy: 1,
    speed: 5
};

console.log(movement);
setInterval(game.tick, SERVER_CONFIG.SERVER_TICK_RATE_IN_MS);