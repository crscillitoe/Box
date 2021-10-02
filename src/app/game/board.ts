import { GameSettings } from "../services/game-setting.service";
import { Enemy } from "./enemy";
import { Player } from "./player";
import { Scout } from "./scout";
import { Tile } from "./tile";
import { Wall } from "./wall";

export class Board {
  private gameSettings: GameSettings;
  private player: Player;
  private tiles: Array<Tile>;

  constructor(player: Player, gameSettings: GameSettings) {
    this.gameSettings = gameSettings;
    this.player = player;
    this.tiles = [];

    this.tiles.push(
      new Wall(3, 4),
      new Wall(4, 4),
      new Wall(5, 4),
      new Wall(6, 4),
      new Scout({ x: 5, y: 5 }, { x: 5, y: 8 }),
      new Enemy({ x: 7, y: 7 }, 10)
    );
  }

  getTiles(): Array<Tile> {
    return this.tiles;
  }

  makeMove(x: number, y: number) {
    if (
      x + 1 > this.gameSettings.gridWidth ||
      y + 1 > this.gameSettings.gridHeight ||
      x < 0 ||
      y < 0
    )
      return;

    for (const tile of this.tiles) {
      tile.onTick(this.player, this);
    }

    for (const tile of this.tiles) {
      const tileDesiredLocation = tile.handleMove(this.player, this, { x, y });
      if (tileDesiredLocation) {
        this.player.moveTo(tileDesiredLocation.x, tileDesiredLocation.y);
        return;
      }
    }

    this.player.moveTo(x, y);
  }

  getPlayer() {
    return this.player;
  }
}
