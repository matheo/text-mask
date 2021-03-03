export interface ConformConfig {
  previousConformedValue?: string;
  guide?: boolean;
  placeholder?: string;
  placeholderChar: string;
  pipe?: ProvidedPipe;
  currentCaretPosition: number | null;
  keepCharPositions: boolean;
  rawValue?: string;
}

export interface ConformResponse {
  conformedValue: string;
  meta: {
    someCharsRejected: boolean;
  };
}

export interface CaretConfig {
  previousConformedValue?: string;
  previousPlaceholder?: string;
  guide?: boolean;
  currentCaretPosition: number;
  conformedValue: string;
  rawValue: string;
  placeholderChar: string;
  placeholder: string;
  indexesOfPipedChars?: number[];
  caretTrapIndexes?: number[];
}

export interface TextMaskState {
  previousConformedValue?: string;
  previousPlaceholder?: string;
}

export interface MaskParams {
  currentCaretPosition?: number | null;
  previousConformedValue?: string;
  placeholderChar?: string;
}

export type MaskCreator = (raw: string, params: MaskParams) => Mask;

export type Mask = Array<string | RegExp>;

export type ProvidedPipe = (conformedValue: string, config: ConformConfig) => false | string | object;

export interface MaskObject {
  mask: Mask;
  pipe: ProvidedPipe;
}

export class TextMaskConfig {
  mask?: Mask | MaskCreator | MaskObject | false;
  guide?: boolean;
  placeholderChar?: string;
  pipe?: ProvidedPipe;
  keepCharPositions?: boolean;
  showMask?: boolean;
}

export interface MaskConfig extends TextMaskConfig {
  inputElement: HTMLInputElement;
}
