
export function init() {
  const _convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
  (Window_Base as any).prototype.convertEscapeCharacters = function(text0: string) {
    const text1 = _convertEscapeCharacters.call(this, text0);
    const text2 = text1.replace(/@char-name\(@var\((\d+)\)\)/gi, (_: string, id: string) => {
      const value = $gameVariables.value(Number(id));
      const actor = $gameActors.actor(value);
      return actor._name;
    });
    return text2;
  }
}

