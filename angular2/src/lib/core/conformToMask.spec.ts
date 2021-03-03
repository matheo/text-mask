import _ from 'lodash';
import dynamicTests from 'mocha-dynamic-tests';
import testParameters, {
  noGuideMode,
  acceptedCharInMask,
  escapedMaskChar
} from './tests/testParameters';
import keepCharPositionsTests from './tests/keepCharPositionsTests';
import maskFunctionTests from './tests/maskFunctionTests';
import {convertMaskToPlaceholder} from './utilities';
import {defaultPlaceholderChar } from './constants';
import { conformToMask, err } from './conformToMask';

const testInputs = ['rawValue', 'mask', 'previousConformedValue', 'currentCaretPosition'];

describe('conformToMask', () => {
  it('throws if mask is not an array or function', () => {
    expect(() => conformToMask('', false as any)).toThrowError(err);
    expect(() => conformToMask('', true as any)).toThrowError(err);
    expect(() => conformToMask('', 'abc' as any)).toThrowError(err);
    expect(() => conformToMask('', 123 as any)).toThrowError(err);
    expect(() => conformToMask('', null as any)).toThrowError(err);
    expect(() => conformToMask('', {} as any)).toThrowError(err);
  });

  describe('Accepted character in mask', () => {
    dynamicTests(
      _.filter(acceptedCharInMask, test => !test.skip),

      (test) => ({
        description: `for input ${JSON.stringify(_.pick(test, testInputs))}, ` +
        `it outputs '${test.conformedValue}' Line: ${test.line}`,

        body: () => {
          expect(conformToMask(test.rawValue, test.mask, {
            guide: true,
            previousConformedValue: test.previousConformedValue,
            placeholder: convertMaskToPlaceholder(test.mask, defaultPlaceholderChar),
            currentCaretPosition: test.currentCaretPosition
          }).conformedValue).toEqual(test.conformedValue);
        }
      })
    );
  });

  describe('Guide mode tests', () => {
    dynamicTests(
      testParameters,

      (test) => ({
        description: `for input ${JSON.stringify(_.pick(test, testInputs))}, ` +
        `it outputs '${test.conformedValue}' Line: ${test.line}`,

        body: () => {
          expect(conformToMask(
            test.rawValue,
            test.mask,
            {
              previousConformedValue: test.previousConformedValue,
              placeholder: convertMaskToPlaceholder(test.mask, defaultPlaceholderChar),
              currentCaretPosition: test.currentCaretPosition
            }
          ).conformedValue).toEqual(test.conformedValue);
        }
      })
    );
  });

  describe('No guide mode', () => {
    dynamicTests(
      noGuideMode,

      (test) => ({
        description: `for input ${JSON.stringify(_.pick(test, testInputs))}, ` +
        `it outputs '${test.conformedValue}'`,

        body: () => {
          expect(conformToMask(
            test.rawValue,
            test.mask,
            {
              guide: false,
              previousConformedValue: test.previousConformedValue,
              placeholder: convertMaskToPlaceholder(test.mask, defaultPlaceholderChar),
              currentCaretPosition: test.currentCaretPosition
            }
          ).conformedValue).toEqual(test.conformedValue);
        }
      })
    );
  });

  describe('Allow escaped masking character in mask', () => {
    dynamicTests(
      escapedMaskChar,

      (test) => ({
        description: `for input ${JSON.stringify(_.pick(test, testInputs))}, ` +
        `it outputs '${test.conformedValue}'`,

        body: () => {
          expect(conformToMask(
            test.rawValue,
            test.mask,
            {
              guide: true,
              previousConformedValue: test.previousConformedValue,
              placeholder: convertMaskToPlaceholder(test.mask, defaultPlaceholderChar),
              currentCaretPosition: test.currentCaretPosition
            }
          ).conformedValue).toEqual(test.conformedValue);
        }
      })
    );
  });

  describe('keepCharPositionsTests', () => {
    dynamicTests(
      keepCharPositionsTests,

      (test) => ({
        description: `for input ${JSON.stringify(_.pick(test, testInputs))}, ` +
        `it outputs '${test.conformedValue}' Line: ${test.line}`,

        body: () => {
          expect(conformToMask(
            test.rawValue,
            test.mask,
            {
              guide: true,
              previousConformedValue: test.previousConformedValue,
              placeholder: convertMaskToPlaceholder(test.mask, defaultPlaceholderChar),
              keepCharPositions: true,
              currentCaretPosition: test.currentCaretPosition
            }
          ).conformedValue).toEqual(test.conformedValue);
        }
      })
    );
  });

  describe('Mask function', () => {
    it('works with mask functions', () => {
      const mask = () => [/\d/, /\d/, /\d/, /\d/];

      expect(() => conformToMask('', mask)).not.toThrow();
    });

    it('calls the mask function', () => {
      const creator = () => [/\d/, /\d/, /\d/, /\d/];
      const maskSpy = jasmine.createSpy('creator', creator).and.callThrough();
      const result = conformToMask('2', maskSpy);

      expect(result.conformedValue).toEqual('2___');
      expect(maskSpy).toHaveBeenCalledTimes(1);
    });

    it('passes the rawValue to the mask function', () => {
      const mask = (value) => {
        expect(typeof value).toEqual('string');
        expect(value).toEqual('2');
        return [/\d/, /\d/, /\d/, /\d/];
      };
      const result = conformToMask('2', mask);

      expect(result.conformedValue).toEqual('2___');
    });

    it('passes the config to the mask function', () => {
      const mask = (value, config) => {
        expect(typeof config).toEqual('object');
        expect(config).toEqual({
          currentCaretPosition: 2,
          previousConformedValue: '1',
          placeholderChar: '_'
        });
        return [/\d/, /\d/, /\d/, /\d/];
      };
      const result = conformToMask('12', mask, {
        currentCaretPosition: 2,
        previousConformedValue: '1',
        placeholderChar: '_'
      });

      expect(result.conformedValue).toEqual('12__');
    });

    it('processes the result of the mask function and removes caretTraps', () => {
      const mask = () => [/\d/, /\d/, '[]', '.', '[]', /\d/, /\d/];
      const result = conformToMask('2', mask);

      expect(result.conformedValue).toEqual('2_.__');
    });

    dynamicTests(
      maskFunctionTests,

      (test) => ({
        description: `for input ${JSON.stringify(_.pick(test, testInputs))}, ` +
        `it outputs '${test.conformedValue}' Line: ${test.line}`,

        body: () => {
          expect(conformToMask(
            test.rawValue,
            test.mask,
            {
              guide: true,
              previousConformedValue: test.previousConformedValue,
              placeholder: convertMaskToPlaceholder(test.mask, defaultPlaceholderChar),
              currentCaretPosition: test.currentCaretPosition
            }
          ).conformedValue).toEqual(test.conformedValue);
        }
      })
    );
  });
});
