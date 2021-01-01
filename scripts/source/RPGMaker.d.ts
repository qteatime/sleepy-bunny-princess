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
}

declare abstract class Scene_Base extends Sprite {
  constructor();
  abstract create(): void;
  update(): void;
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
