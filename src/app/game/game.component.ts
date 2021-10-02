import { Component, HostListener, OnInit } from "@angular/core";
import {
  GameSettings,
  GameSettingService,
} from "../services/game-setting.service";
import { Board } from "./board";
import { CanvasRenderHelper } from "./canvasRenderHelper";
import { Coordinate, Player } from "./player";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private gameSettings: GameSettings;
  private board: Board;
  private canvasRenderHelper: CanvasRenderHelper;

  ngOnInit(): void {
    // Initialize settings for the game
    this.gameSettings = GameSettingService.getDefaultGameSettings();
    const player = new Player({
      x: 0,
      y: 0,
    });

    this.board = new Board(player, this.gameSettings);

    this.canvasRenderHelper = new CanvasRenderHelper(/* */);

    this.canvasRenderHelper.previousX = player.location.x;
    this.canvasRenderHelper.previousY = player.location.y;

    // Connect to the canvas for drawing to the screen
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");

    this.fixSizes();
  }

  drawOther(): void {
    this.fixLag();
    this.drawBackground();
    this.drawTiles();
  }

  draw(): void {
    this.fixLag();
    this.drawBackground();
    // this.drawGrid();
    this.drawPlayer(
      this.canvasRenderHelper.previousX,
      this.canvasRenderHelper.previousY,
      this.canvasRenderHelper.previousX,
      this.canvasRenderHelper.previousY
    );
    this.drawTiles();
  }

  drawTiles(): void {
    for (const tile of this.board.getTiles()) {
      this.drawColoredTile(tile.getLocation(), tile.getColor(), 3);
    }
  }

  drawPlayer(
    startX: number,
    startY: number,
    currX: number,
    currY: number
  ): void {
    if (
      startX !== this.canvasRenderHelper.previousX ||
      startY !== this.canvasRenderHelper.previousY
    )
      return;

    const player = this.board.getPlayer();
    let continueAnimation = true;

    if (
      (currX > player.location.x && startX < player.location.x) ||
      (currY > player.location.y && startY < player.location.y) ||
      (currX < player.location.x && startX > player.location.x) ||
      (currY < player.location.y && startY > player.location.y)
    ) {
      currX = player.location.x;
      currY = player.location.y;
      continueAnimation = false;
    }

    if (!continueAnimation) {
      this.drawOther();
    }
    this.drawColoredTile({ x: currX, y: currY }, "#00FF00");
    this.drawHealthBar(
      { x: currX, y: currY },
      player.health,
      player.maxHealth,
      "red"
    );

    let xInc = (player.location.x - startX) / 10;
    let yInc = (player.location.y - startY) / 10;
    if (continueAnimation) {
      setTimeout((): void => {
        this.drawColoredTile({ x: currX, y: currY }, "#303030", 1);
        this.drawPlayer(startX, startY, currX + xInc, currY + yInc);
      }, 15);
    }
  }

  drawHealthBar(
    location: Coordinate,
    health: number,
    maxHealth: number,
    color: string = "green"
  ) {
    this.context.fillStyle = color;

    const fullWidth = this.canvasRenderHelper.squareSize - 20;

    this.context.fillRect(
      10 +
        this.canvasRenderHelper.xAdd +
        location.x * this.canvasRenderHelper.squareSize,
      10 +
        this.canvasRenderHelper.yAdd +
        location.y * this.canvasRenderHelper.squareSize,
      fullWidth * (health / maxHealth),
      15
    );
  }

  drawColoredTile(
    location: Coordinate,
    color: string,
    negateBuffer: number = 0
  ) {
    const buffer = 2 - negateBuffer;
    this.context.fillStyle = color;

    this.context.fillRect(
      buffer +
        this.canvasRenderHelper.xAdd +
        location.x * this.canvasRenderHelper.squareSize,
      buffer +
        this.canvasRenderHelper.yAdd +
        location.y * this.canvasRenderHelper.squareSize,
      this.canvasRenderHelper.squareSize - buffer * 2,
      this.canvasRenderHelper.squareSize - buffer * 2
    );
  }

  /**
   * Draws the grid onto the canvas.
   * Inner grid elements will always be cubic.
   * Grid will be centered.
   */
  drawGrid(): void {
    // Step 1: determine position of top left corner of grid
    const topLeft: Coordinate = {
      x: this.canvasRenderHelper.xAdd,
      y: this.canvasRenderHelper.yAdd,
    };

    this.context.strokeStyle = "#FFFFFF";

    // Step 3: draw horizontal lines
    for (let i = 0; i <= this.gameSettings.gridHeight; i++) {
      this.context.moveTo(
        topLeft.x,
        topLeft.y + i * this.canvasRenderHelper.squareSize
      );
      this.context.lineTo(
        topLeft.x +
          this.canvasRenderHelper.squareSize * this.gameSettings.gridWidth,
        topLeft.y + i * this.canvasRenderHelper.squareSize
      );
      this.context.stroke();
    }

    // Step 4: draw vertical lines
    for (let j = 0; j <= this.gameSettings.gridWidth; j++) {
      this.context.moveTo(
        topLeft.x + j * this.canvasRenderHelper.squareSize,
        topLeft.y
      );
      this.context.lineTo(
        topLeft.x + j * this.canvasRenderHelper.squareSize,
        topLeft.y +
          this.canvasRenderHelper.squareSize * this.gameSettings.gridHeight
      );
      this.context.stroke();
    }
  }

  fixSizes() {
    this.context.beginPath();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.context.translate(0.5, 0.5);

    const larger = Math.max(
      this.gameSettings.gridWidth,
      this.gameSettings.gridHeight
    );
    const size = Math.min(this.canvas.offsetWidth, this.canvas.offsetHeight);

    this.canvasRenderHelper.squareSize = Math.floor(size / larger);
    this.context.font =
      "bold " + Math.round(this.canvasRenderHelper.squareSize) + "px Poppins";

    let w = this.canvas.offsetWidth;
    let h = this.canvas.offsetHeight;

    if (w > h) {
      this.canvasRenderHelper.xAdd = Math.round((w - h) / 2);
      this.canvasRenderHelper.yAdd = 0;
    } else {
      this.canvasRenderHelper.xAdd = 0;
      this.canvasRenderHelper.yAdd = Math.round((h - w) / 2);
    }

    this.draw();
  }

  getMinimumLength(): number {
    return Math.min(this.canvas.width, this.canvas.height);
  }

  fixLag(): void {
    // Fix lag
    this.context.beginPath();
  }

  drawBackground(): void {
    this.context.fillStyle = "#303030";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  @HostListener("document:keydown", ["$event"])
  keyPressed(event: KeyboardEvent) {
    const code = event.code;
    const playerX = this.board.getPlayer().location.x;
    const playerY = this.board.getPlayer().location.y;

    if (code === "KeyW" || code === "ArrowUp") {
      this.board.makeMove(playerX, playerY - 1);
    } else if (code === "KeyS" || code === "ArrowDown") {
      this.board.makeMove(playerX, playerY + 1);
    } else if (code === "KeyA" || code === "ArrowLeft") {
      this.board.makeMove(playerX - 1, playerY);
    } else if (code === "KeyD" || code === "ArrowRight") {
      this.board.makeMove(playerX + 1, playerY);
    }

    const player = this.board.getPlayer();
    if (player.location.x !== playerX || player.location.y !== playerY) {
      this.canvasRenderHelper.previousX = playerX;
      this.canvasRenderHelper.previousY = playerY;
      this.draw();
    }
  }
}
