import { Variables } from "./variables";

export function initialise() {
  const indicator = new MaraIndicator();
  const _create = Scene_Map.prototype.createDisplayObjects;

  Scene_Map.prototype.createDisplayObjects = function() {
    _create.call(this);
    this.addChild(indicator);
  }
}

export class MaraIndicator extends Sprite {
  constructor() {
    const _bitmap = ImageManager.loadPicture("mara-indicator", 0);
    super(_bitmap);
  }

  update() {
    this.visible = this.isVisible;
    super.update();
  }

  get isVisible() {
    return $gameVariables.value(Variables.MARAS_ALIVE) > 0;
  }
}