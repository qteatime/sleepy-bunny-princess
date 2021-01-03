import { Actors, Variables } from "./variables";

// Assumes min and max > 0, max > min
function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min));
}

function randomChoice<A>(list: A[]): A {
  if (list.length === 0) {
    throw new Error(`Can't take the random choice of an empty list`);
  }

  return list[randomInt(0, list.length)];
}

class BunnyGacha {
  _gotCharacters: Set<number> = new Set();

  roll() {
    const candidates = this.computeCandidates()
                           .filter(x => !this._gotCharacters.has(x._actorId));
    const chosen = randomChoice(candidates);
    this._gotCharacters.add(chosen._actorId);
    $gameParty.addActor(chosen._actorId);
    $gameVariables.setValue(Variables.BUNNY_GACHA, chosen._actorId);
  }

  computeCandidates() {
    return $gameActors._data
                      .filter(x => x._actorId !== Actors.PRINCESS);
  }

  fetchBunny(varId: number) {
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

  hasBunnyIdInParty(id: number) {
    return $gameParty._actors.some(x => x === id);
  }

  hasBunnyInParty() {
    return $gameParty._actors.some(x => x !== Actors.PRINCESS);
  }
}

class EncounterGacha {
  private _troops: number[] = [];

  initTroops(ids: number[]) {
    this._troops = ids;
  }

  roll() {
    const total = $gameVariables.value(Variables.NUMBER_OF_MARAS);
    const alive = $gameVariables.value(Variables.MARAS_ALIVE);

    if (this._troops.length === 0 || alive <= 0) {
      $gameVariables.setValue(Variables.MARA_ENCOUNTER, 0);
      return;
    }

    if (randomInt(0, total) < alive) {
      const troop = randomChoice(this._troops);
      $gameVariables.setValue(Variables.MARA_ENCOUNTER, troop);
    } else {
      $gameVariables.setValue(Variables.MARA_ENCOUNTER, 0);
    }
  }
}


export const gacha = new BunnyGacha();
export const encounter = new EncounterGacha();