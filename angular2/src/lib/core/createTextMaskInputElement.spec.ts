import { defaultPlaceholderChar as placeholderChar} from './constants';
import { createTextMaskInputElement } from './createTextMaskInputElement';

describe('createTextMaskInputElement', () => {
  let inputElement;

  beforeEach(() => {
    inputElement = document.createElement('input');
    document.body.appendChild(inputElement);
  });

  it('takes an inputElement and other Text Mask parameters and returns an object which ' +
     'allows updating and controlling the masking of the input element', () => {
    const maskedInputElementControl = createTextMaskInputElement({
      inputElement,
      mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    });

    expect(typeof maskedInputElementControl.update).toBe('function');
  });

  it('works with mask functions', () => {
    const mask = () => [/\d/, /\d/, /\d/, /\d/];

    expect(() => createTextMaskInputElement({inputElement, mask})).not.toThrow();
  });

  it('displays mask when showMask is true', () => {
    const textMaskControl = createTextMaskInputElement({
      showMask: true,
      inputElement,
      mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    });
    textMaskControl.update();
    expect(inputElement.value).toEqual('(___) ___-____');
  });

  it('does not display mask when showMask is false', () => {
    const textMaskControl = createTextMaskInputElement({
      showMask: false,
      inputElement,
      mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    });
    textMaskControl.update();
    expect(inputElement.value).toEqual('');
  });

  describe('`update` method', () => {
    it('conforms whatever value is in the input element to a mask', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement({inputElement, mask});

      inputElement.value = '2';
      textMaskControl.update();
      expect(inputElement.value).toEqual('(2__) ___-____');
    });

    it('works after multiple calls', () => {
      const mask = ['+', '1', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement({ inputElement, mask });

      inputElement.focus();
      inputElement.value = '2';
      textMaskControl.update();
      expect(inputElement.value).toEqual('+1 (2__) ___-____');

      inputElement.value = '+1 (23__) ___-____';
      inputElement.selectionStart = 6;
      textMaskControl.update();
      expect(inputElement.value).toEqual('+1 (23_) ___-____');

      inputElement.value = '+1 (2_) ___-____';
      inputElement.selectionStart = 5;
      textMaskControl.update();
      expect(inputElement.value).toEqual('+1 (2__) ___-____');

      inputElement.value = '+1 (__) ___-____';
      inputElement.selectionStart = 4;
      textMaskControl.update();
      expect(inputElement.value).toEqual('');
    });

    it('accepts a string to conform and overrides whatever value is in the input element', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement({inputElement, mask});

      inputElement.value = '2';
      textMaskControl.update('123');
      expect(inputElement.value).toEqual('(123) ___-____');
    });

    it('accepts an empty string and overrides whatever value is in the input element', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement({inputElement, mask});

      textMaskControl.update(123);
      expect(inputElement.value).toEqual('(123) ___-____');

      textMaskControl.update('');
      expect(inputElement.value).toEqual('');
    });

    it('accepts an empty string after reinitializing text mask', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      let textMaskControl = createTextMaskInputElement({inputElement, mask});

      textMaskControl.update(123);
      expect(inputElement.value).toEqual('(123) ___-____');

      // reset text mask
      textMaskControl = createTextMaskInputElement({inputElement, mask});

      // now clear the value
      textMaskControl.update('');
      expect(inputElement.value).toEqual('');
    });

    it('works with a string', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement({inputElement, mask});

      textMaskControl.update('2');

      expect(inputElement.value).toEqual('(2__) ___-____');
    });

    it('works with a number by coercing it into a string', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement({inputElement, mask});

      textMaskControl.update(2);

      expect(inputElement.value).toEqual('(2__) ___-____');
    });

    it('works with `undefined` and `null` by treating them as empty strings', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement({inputElement, mask});

      textMaskControl.update(undefined);
      expect(inputElement.value).toEqual('');

      textMaskControl.update(null);
      expect(inputElement.value).toEqual('');
    });

    it('throws if given a value that it cannot work with', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement({inputElement, mask});

      expect(() => textMaskControl.update({})).toThrow();
      expect(() => textMaskControl.update(() => 'howdy')).toThrow();
      expect(() => textMaskControl.update([])).toThrow();
    });

    it('adjusts the caret position', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement({inputElement, mask, placeholderChar});

      inputElement.focus();
      inputElement.value = '2';
      inputElement.selectionStart = 1;

      textMaskControl.update();
      expect(inputElement.selectionStart).toEqual(2);
    });

    /*
    it('does not adjust the caret position if the input element is not focused', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement({inputElement, mask});

      inputElement.value = '2';
      inputElement.selectionStart = 1;

      textMaskControl.update();
      expect(inputElement.selectionStart).toEqual(0);
    });
    */

    it('calls the mask function before every update', () => {
      const creator = () => [/\d/, /\d/, /\d/, /\d/];
      const maskSpy = jasmine.createSpy('creator', creator).and.callThrough();
      const textMaskControl = createTextMaskInputElement({inputElement, mask: maskSpy});

      inputElement.value = '2';
      textMaskControl.update();
      expect(inputElement.value).toEqual('2___');

      inputElement.value = '24';
      textMaskControl.update();
      expect(inputElement.value).toEqual('24__');

      expect(maskSpy).toHaveBeenCalledTimes(2);
    });

    it('can be disabled with `false` mask', () => {
      const mask = false;
      const textMaskControl = createTextMaskInputElement({inputElement, mask});

      inputElement.value = 'a';
      textMaskControl.update();
      expect(inputElement.value).toEqual('a');
    });

    /*
    it('can be disabled by returning `false` from mask function', () => {
      const mask: () => false = () => false;
      const textMaskControl = createTextMaskInputElement({inputElement, mask});

      inputElement.value = 'a';
      textMaskControl.update();
      expect(inputElement.value).toEqual('a');
    });
    */

    it('can pass in a config object to the update method', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement();

      const input = {value: '2'};

      textMaskControl.update(input.value, {inputElement: input, mask});
      expect(input.value).toEqual('(2__) ___-____');
    });

    it('can change the mask passed to the update method', () => {
      const textMaskControl = createTextMaskInputElement();

      const input = {value: '2'};

      textMaskControl.update(input.value, {
        inputElement: input,
        mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
      });
      expect(input.value).toEqual('(2__) ___-____');

      textMaskControl.update('2', {
        inputElement: input,
        mask: ['+', '1', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
      });
      expect(input.value).toEqual('+1 (2__) ___-____');
    });

    it('can change the guide passed to the update method', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement();

      const input = {value: '2'};

      textMaskControl.update(input.value, {inputElement: input, mask, guide: true});
      expect(input.value).toEqual('(2__) ___-____');

      textMaskControl.update('2', {inputElement: input, mask, guide: false});
      expect(input.value).toEqual('(2');
    });

    it('can change the placeholderChar passed to the update method', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement();

      const input = {value: '2'};

      textMaskControl.update(input.value, {inputElement: input, mask, placeholderChar: '_'});
      expect(input.value).toEqual('(2__) ___-____');

      textMaskControl.update('2', {inputElement: input, mask, placeholderChar: '*'});
      expect(input.value).toEqual('(2**) ***-****');
    });

    it('can change the inputElement passed to the update method', () => {
      const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      const textMaskControl = createTextMaskInputElement();

      const firstInputElement = {value: '1'};
      const secondInputElement = {value: '2'};

      textMaskControl.update('1', {inputElement: firstInputElement, mask});
      expect(firstInputElement.value).toEqual('(1__) ___-____');

      textMaskControl.update('2', {inputElement: secondInputElement, mask});
      expect(secondInputElement.value).toEqual('(2__) ___-____');
    });

    it('can change the config passed to createTextMaskInputElement', () => {
      const config = {
        inputElement,
        mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        guide: true,
        placeholderChar: '_'
      };
      const textMaskControl = createTextMaskInputElement(config);

      inputElement.value = '2';
      textMaskControl.update();
      expect(inputElement.value).toEqual('(2__) ___-____');

      // change the mask
      config.mask = ['+', '1', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      inputElement.value = '23'; // <- you have to change the value
      textMaskControl.update();
      expect(inputElement.value).toEqual('+1 (23_) ___-____');

      // change the placeholderChar
      config.placeholderChar = '*';
      inputElement.value = '4'; // <- you have to change the value
      textMaskControl.update();
      expect(inputElement.value).toEqual('+1 (4**) ***-****');

      // change the guide
      config.guide = false;
      inputElement.value = '45'; // <- you have to change the value
      textMaskControl.update();
      expect(inputElement.value).toEqual('+1 (45');
    });

    it('can override the config passed to createTextMaskInputElement', () => {
      const textMaskControl = createTextMaskInputElement({
        inputElement,
        mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        guide: true
      });

      inputElement.value = '2';
      textMaskControl.update();
      expect(inputElement.value).toEqual('(2__) ___-____');

      // pass in a config to the update method
      textMaskControl.update('23', {
        inputElement,
        mask: ['+', '1', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        guide: false
      });
      expect(inputElement.value).toEqual('+1 (23');

      // use original config again
      inputElement.value = '234'; // <- you have to change the value
      textMaskControl.update();
      expect(inputElement.value).toEqual('(234) ___-____');
    });
  });
});
