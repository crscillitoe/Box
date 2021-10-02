export class Player {
  public health: number;
  public maxHealth: number;
  public location: Coordinate;

  constructor(location: Coordinate) {
    this.health = 100;
    this.maxHealth = 100;
    this.location = location;
  }

  moveTo(x: number, y: number) {
    this.location.x = x;
    this.location.y = y;
  }
}

export interface Coordinate {
  x: number;
  y: number;
}
