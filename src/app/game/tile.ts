import { Board } from "./board";
import { Coordinate, Player } from "./player";

export interface Tile {
  getColor(): string;
  getLocation(): Coordinate;
  // Could result in side effects by design
  handleMove(
    player: Player,
    board: Board,
    targetLocation: Coordinate
  ): Coordinate | null;

  onTick(player: Player, board: Board): void;
}
