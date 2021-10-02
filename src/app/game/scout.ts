import { Board } from "./board";
import { Coordinate, Player } from "./player";
import { Tile } from "./tile";

export class Scout implements Tile {
  private patrolStart: Coordinate;
  private patrolEnd: Coordinate;
  private location: Coordinate;
  constructor(patrolStart: Coordinate, patrolEnd: Coordinate) {
    this.patrolStart = patrolStart;
    this.location = { x: patrolStart.x, y: patrolStart.y };
    this.patrolEnd = patrolEnd;
  }
  onTick(player: Player, board: Board): void {
    if (
      this.location.x === this.patrolEnd.x &&
      this.location.y === this.patrolEnd.y
    ) {
      const temp = this.patrolStart;
      this.patrolStart = this.patrolEnd;
      this.patrolEnd = temp;
    }

    const deltaX = this.patrolEnd.x - this.patrolStart.x;
    const deltaY = this.patrolEnd.y - this.patrolStart.y;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (deltaX !== 0) this.location.x += deltaX / absDeltaX;
    if (deltaY !== 0) this.location.y += deltaY / absDeltaY;
  }
  getColor(): string {
    return "red";
  }
  getLocation(): Coordinate {
    return this.location;
  }
  handleMove(
    player: Player,
    board: Board,
    targetLocation: Coordinate
  ): Coordinate {
    return null;
  }
}
