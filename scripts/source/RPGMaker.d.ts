declare class Bitmap {}

declare class Sprite {
  constructor(bitmap: Bitmap | null);
  bitmap: Bitmap;
  addChild(sprite: Sprite): void;
  removeChild(sprite: Sprite): void;
  move(x: number, y: number): void;
  update(): void;
  children: Sprite[];
  x: number;
  y: number;
  angle: number;
  alpha: number;
  visible: boolean;
}

declare abstract class Scene_Base extends Sprite {
  constructor();
  abstract create(): void;
  update(): void;
}

declare abstract class Scene_Map extends Scene_Base {
  createDisplayObjects(): void;
}

declare var SceneManager: {
  backgroundBitmap(): Bitmap;
  push(scene: Scene_Base): void;
  pop(): void;
  goto(scene: Scene_Base): void;
};

declare var ImageManager: {
  loadPicture(name: string, hue: number): Bitmap;
};

declare var Input: {
  isTriggered(key: string): boolean;
};

declare class Game_Actor {
  _name: string;
  _faceName: string;
  _profile: string;
  _actorId: number;
  level: number;
  hp: number;
  mhp: number;
  mp: number;
  mmp: number;
}

declare var $gameActors: Game_Actors;

declare class Game_Actors {
  _data: Game_Actor[]
  actor(actorId: number): Game_Actor;
}

declare class Game_Party {
  _actors: number[];
  _gold: number;
  _inBattle: boolean;
  _items: { [key: number]: number }; // id -> count

  addActor(actorId: number): void;
  removeActor(actorId: number): void;
}

declare var $gameParty: Game_Party;

declare class Game_Troop {
  _inBattle: false;
  _turnCount: number;
}

declare class Window_Base {
  convertEscapeCharacters(text: string): string;
}

declare class Game_Variables {
  setValue(id: number, value: number): void;
  value(id: number): number;
}

declare var $gameVariables: Game_Variables;