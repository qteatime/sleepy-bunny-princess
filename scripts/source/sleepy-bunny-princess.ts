/**
 * @plugindesc The custom stuff for Sleepy Bunny Princess
 * @author Q.
 */
import {
  UIScene,
  UIBox,
  UIButton,
  UIMapBackground,
  UIImage,
  UITransform,
  UIElement,
} from "./Uai";
import * as TextFormat from "./text-format";
import * as BunnyGacha from "./gacha";
import * as Screens from "./screens";

export function initialise() {
  const MAX_CHARS = 4;
  for (let i = 1; i <= MAX_CHARS; ++i) {
    $gameActors.actor(i);
  }
}

TextFormat.init();
Screens.initialise();
export { BunnyGacha }