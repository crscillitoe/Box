import { Board } from "./board";
import { Coordinate, Player } from "./player";
import { Tile } from "./tile";

export class Wall implements Tile {
  private location: Coordinate;
  constructor(x: number, y: number) {
    this.location = { x, y };
  }
  onTick(player: Player, board: Board): void {
    return;
  }
  handleMove(
    player: Player,
    board: Board,
    targetLocation: Coordinate
  ): Coordinate {
    if (
      targetLocation.x === this.location.x &&
      targetLocation.y === this.location.y
    )
      return player.location;
  }

  getColor(): string {
    return "orange";
  }
  getLocation(): Coordinate {
    return this.location;
  }
}
