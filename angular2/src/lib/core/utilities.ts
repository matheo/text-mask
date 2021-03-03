import { defaultPlaceholderChar } from './constants';
import { Mask, MaskCreator, MaskObject } from './typings';

export const err = 'text-mask: convertMaskToPlaceholder; The mask property must be an array.';

export function convertMaskToPlaceholder(
  mask: Mask,
  placeholderChar = defaultPlaceholderChar
): string {
  if (!isArray(mask)) {
    throw new Error(err);
  }

  if (mask.indexOf(placeholderChar) !== -1) {
    throw new Error(
      'Placeholder character must not be used as part of the mask. Please specify a character ' +
      'that is not present in your mask as your placeholder character.\n\n' +
      `The placeholder character that was received is: ${JSON.stringify(placeholderChar)}\n\n` +
      `The mask that was received is: ${JSON.stringify(mask)}`
    );
  }

  return mask.map((char) => {
    return (char instanceof RegExp) ? placeholderChar : char;
  }).join('');
}

export function isMaskCreator(value: any): value is MaskCreator {
  return typeof value === 'function';
}

export function isMaskObject(value: any): value is MaskObject {
  return typeof value === 'object' && value.pipe !== undefined && value.mask !== undefined;
}

export function isArray<T>(value: any): value is Array<T> {
  return (Array.isArray && Array.isArray(value)) || value instanceof Array;
}

export function isString(value: any): value is string {
  return typeof value === 'string' || value instanceof String;
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isNil(value: any): value is null {
  return typeof value === 'undefined' || value === null;
}

export function processCaretTraps(mask: Mask): number[] {
  const caretTrapIndexes: number[] = [];
  let indexOfCaretTrap: number = mask?.indexOf('[]');

  while (mask && indexOfCaretTrap !== -1) {
    caretTrapIndexes.push(indexOfCaretTrap);
    mask.splice(indexOfCaretTrap, 1);
    indexOfCaretTrap = mask.indexOf('[]');
  }

  return caretTrapIndexes;
}
