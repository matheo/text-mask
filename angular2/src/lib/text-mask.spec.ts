import { MaskedInputDirective } from './text-mask'

describe('MaskedInputDirective', () => {
  it('should create an instance', () => {
    const directive = new MaskedInputDirective(null, null, false)
    expect(directive).toBeTruthy()
  })
})
