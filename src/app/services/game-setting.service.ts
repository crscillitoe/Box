import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GameSettingService {
  static getDefaultGameSettings(): GameSettings {
    return {
      gridWidth: 10,
      gridHeight: 10,
      seed: 100, // TODO: Random Seed.
    };
  }
}

export interface GameSettings {
  gridWidth: number;
  gridHeight: number;
  seed: number;
}
