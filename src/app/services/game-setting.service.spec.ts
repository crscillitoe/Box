import { TestBed } from '@angular/core/testing';

import { GameSettingService } from './game-setting.service';

describe('GameSettingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameSettingService = TestBed.get(GameSettingService);
    expect(service).toBeTruthy();
  });
});
