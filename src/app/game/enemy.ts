import { Board } from "./board";
import { Coordinate, Player } from "./player";
import { Tile } from "./tile";

export class Enemy implements Tile {
  private location: Coordinate;
  private damageDealt: number;
  constructor(location: Coordinate, damageDealt: number) {
    this.location = location;
    this.damageDealt = damageDealt;
  }
  onTick(player: Player, board: Board): void {}
  getColor(): string {
    return "orangered";
  }
  getLocation(): Coordinate {
    return this.location;
  }
  handleMove(
    player: Player,
    board: Board,
    targetLocation: Coordinate
  ): Coordinate {
    if (
      targetLocation.x === this.location.x &&
      targetLocation.y === this.location.y
    ) {
      player.health -= this.damageDealt;
    }

    return null;
  }
}
