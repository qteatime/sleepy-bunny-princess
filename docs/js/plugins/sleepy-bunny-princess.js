(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SBP = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encounter = exports.gacha = void 0;
const variables_1 = require("./variables");
// Assumes min and max > 0, max > min
function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}
function randomChoice(list) {
    if (list.length === 0) {
        throw new Error(`Can't take the random choice of an empty list`);
    }
    return list[randomInt(0, list.length)];
}
class BunnyGacha {
    constructor() {
        this._gotCharacters = new Set();
    }
    roll() {
        const candidates = this.computeCandidates()
            .filter(x => !this._gotCharacters.has(x._actorId));
        const chosen = randomChoice(candidates);
        this._gotCharacters.add(chosen._actorId);
        $gameParty.addActor(chosen._actorId);
        $gameVariables.setValue(variables_1.Variables.BUNNY_GACHA, chosen._actorId);
    }
    computeCandidates() {
        return $gameActors._data
            .filter(x => x._actorId !== variables_1.Actors.PRINCESS);
    }
    fetchBunny(varId) {
        $gameParty.addActor(varId);
    }
    fetchAllBunnies() {
        for (const id of this._gotCharacters.values()) {
            if (!this.hasBunnyIdInParty(id)) {
                this.fetchBunny(id);
            }
        }
    }
    hasBunniesToFetch() {
        for (const id of this._gotCharacters.values()) {
            if (!this.hasBunnyIdInParty(id)) {
                return true;
            }
        }
        return false;
    }
    hasBunnyIdInParty(id) {
        return $gameParty._actors.some(x => x === id);
    }
    hasBunnyInParty() {
        return $gameParty._actors.some(x => x !== variables_1.Actors.PRINCESS);
    }
}
class EncounterGacha {
    constructor() {
        this._troops = [];
    }
    initTroops(ids) {
        this._troops = ids;
    }
    roll() {
        const total = $gameVariables.value(variables_1.Variables.NUMBER_OF_MARAS);
        const alive = $gameVariables.value(variables_1.Variables.MARAS_ALIVE);
        if (this._troops.length === 0 || alive <= 0) {
            $gameVariables.setValue(variables_1.Variables.MARA_ENCOUNTER, 0);
            return;
        }
        if (randomInt(0, total) < alive) {
            const troop = randomChoice(this._troops);
            $gameVariables.setValue(variables_1.Variables.MARA_ENCOUNTER, troop);
        }
        else {
            $gameVariables.setValue(variables_1.Variables.MARA_ENCOUNTER, 0);
        }
    }
}
exports.gacha = new BunnyGacha();
exports.encounter = new EncounterGacha();

},{"./variables":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaraIndicator = exports.initialise = void 0;
const variables_1 = require("./variables");
function initialise() {
    const indicator = new MaraIndicator();
    const _create = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function () {
        _create.call(this);
        this.addChild(indicator);
    };
}
exports.initialise = initialise;
class MaraIndicator extends Sprite {
    constructor() {
        const _bitmap = ImageManager.loadPicture("mara-indicator", 0);
        super(_bitmap);
    }
    update() {
        this.visible = this.isVisible;
        super.update();
    }
    get isVisible() {
        return $gameVariables.value(variables_1.Variables.MARAS_ALIVE) > 0;
    }
}
exports.MaraIndicator = MaraIndicator;

},{"./variables":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BunnyGacha = exports.initialise = void 0;
const TextFormat = require("./text-format");
const BunnyGacha = require("./gacha");
exports.BunnyGacha = BunnyGacha;
const Screens = require("./screens");
function initialise() {
    const MAX_CHARS = 4;
    for (let i = 1; i <= MAX_CHARS; ++i) {
        $gameActors.actor(i);
    }
}
exports.initialise = initialise;
TextFormat.init();
Screens.initialise();

},{"./gacha":1,"./screens":2,"./text-format":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
function init() {
    const _convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function (text0) {
        const text1 = _convertEscapeCharacters.call(this, text0);
        const text2 = text1.replace(/@char-name\(@var\((\d+)\)\)/gi, (_, id) => {
            const value = $gameVariables.value(Number(id));
            const actor = $gameActors.actor(value);
            return actor._name;
        });
        return text2;
    };
}
exports.init = init;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switches = exports.Actors = exports.Variables = void 0;
var Variables;
(function (Variables) {
    Variables[Variables["BUNNY_GACHA"] = 1] = "BUNNY_GACHA";
    Variables[Variables["SELECTED_BUNNY"] = 2] = "SELECTED_BUNNY";
    Variables[Variables["NUMBER_OF_MARAS"] = 3] = "NUMBER_OF_MARAS";
    Variables[Variables["MARAS_ALIVE"] = 4] = "MARAS_ALIVE";
    Variables[Variables["MARA_ENCOUNTER"] = 5] = "MARA_ENCOUNTER";
})(Variables = exports.Variables || (exports.Variables = {}));
var Actors;
(function (Actors) {
    Actors[Actors["PRINCESS"] = 1] = "PRINCESS";
})(Actors = exports.Actors || (exports.Actors = {}));
var Switches;
(function (Switches) {
})(Switches = exports.Switches || (exports.Switches = {}));

},{}]},{},[3])(3)
});
