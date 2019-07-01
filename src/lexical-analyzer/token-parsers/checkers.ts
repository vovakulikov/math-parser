
export function isDigit(character: string): boolean {
  return !isNaN(parseInt(character, 10));
}

export function isCharacter(standard: string): (char: string) => boolean {
  return (character: string) => standard === character;
}
