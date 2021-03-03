import { convertMaskToPlaceholder, err, processCaretTraps } from './utilities';

describe('convertMaskToPlaceholder', () => {
  it('throws if mask is not an array', () => {
    expect(() => convertMaskToPlaceholder(false as any)).toThrowError(err);
    expect(() => convertMaskToPlaceholder(true as any)).toThrowError(err);
    expect(() => convertMaskToPlaceholder('abc' as any)).toThrowError(err);
    expect(() => convertMaskToPlaceholder(123 as any)).toThrowError(err);
    expect(() => convertMaskToPlaceholder(null as any)).toThrowError(err);
    expect(() => convertMaskToPlaceholder({} as any)).toThrowError(err);
    expect(() => convertMaskToPlaceholder((() => {}) as any)).toThrowError(err);
  });
});

describe('processCaretTraps', () => {
  it('returns the mask without caret traps and the caret trap indexes', () => {
    const mask = ['$', /\d/, /\d/, /\d/, /\d/, '.', '[]', /\d/, /\d/];
    expect(processCaretTraps(mask)).toEqual([6]);
    expect(mask).toEqual(['$', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/]);

    const mask2 = ['$', /\d/, /\d/, /\d/, /\d/, '[]', '.', '[]', /\d/, /\d/];
    expect(processCaretTraps(mask2)).toEqual([5, 6]);
    expect(mask2).toEqual(['$', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/]);
  });
});
