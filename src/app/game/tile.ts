import { Board } from "./board";
import { Coordinate, Player } from "./player";

export interface Tile {
  getColor(): string;
  getLocation(): Coordinate;
  /**
  // Could result in side effects by design
  */
  handleMove(
    player: Player,
    board: Board,
    targetLocation: Coordinate
  ): Coordinate | null;

  /**
  // Might have side effects
  // Might not
  // Don't count on either
  // Or you'll regret it
  //
  // This is by design
  */
  onTick(player: Player, board: Board): void;
}
