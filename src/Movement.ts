import { Input } from "./types/Input.js";
import {Player} from "./types/Player.js";
import { Position } from "./types/Position.js";
import { InputType } from "./types/InputType.js";

export default class Movement {
    public input: Input;
    public player: Player;
    
    constructor(input: Input, player: Player) {
        this.input = input;
        this.player = player;
    }

    calculatePosition(player: Player, input: Input): Position {
        if(input.type === InputType.MOVE) {
            //TODO yeni pozisyon olustururken, oyunun guncel haritasindaki istisnai durumlarda goz onunde bulundurulmali !!! Collision olaylari vb.
            const clampedSpeed: number = this.clampSpeed(player, input);
            const clampedDx: number = this.clampDirectionValue(input.movement.dx);
            const clampedDy: number = this.clampDirectionValue(input.movement.dy);
            const newPosition: Position = {
                x: player.position.x + (clampedDx * clampedSpeed),
                y: player.position.y + (clampedDy * clampedSpeed),
                rotation: player.position.rotation,
            };
            return this.checkAnyCollisionBetweenOldAndNewPosition(player.oldPosition, newPosition);
        }else {
            return player.position;
        }
    }

    private checkAnyCollisionBetweenOldAndNewPosition(oldPosition: Position, newPosition: Position): Position {
        //TODO Collision kontrolu
        /*
            Yem almis mi?
            Herhangi baska bir dusman ile collision var mi?
            Map icerisindeki herhangi bir engel icin collision var mi?
        */
        return newPosition;
    }

    private clampSpeed(player: Player, input: Input): number {
        //TODO: Oyunun genel kurallari goz onunde bulundurularak, kullanicinin onceki speed degeriyle bir clamp islemi uygulanacak
        return player.movement.speed;
    }

    private clampDirectionValue(directionValue: number): number {
        if(directionValue > 0 && directionValue > 1) {
            return 1;
        } else if(directionValue < 0 && directionValue < -1) {
            return -1;
        }else {
            return directionValue;
        }
    }

}