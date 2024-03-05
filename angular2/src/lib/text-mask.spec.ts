import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SpectatorDirective, createDirectiveFactory } from '@ngneat/spectator';
import { MaskedInputDirective } from './text-mask';

describe('MaskedInputDirective', () => {
  let spectator: SpectatorDirective<MaskedInputDirective, { form: UntypedFormGroup }>;

  const createDirective = createDirectiveFactory({
    directive: MaskedInputDirective,
    imports: [
      ReactiveFormsModule,
    ]
  });

  const setupDirective = (() => {
    spectator = createDirective(`
      <form [formGroup]="form">
        <input [textMask]="textMask" formControlName="name" />
      </form>
    `, {
      hostProps: {
        form: new UntypedFormBuilder().group({
          name: ['', Validators.required],
        }) as UntypedFormGroup,
        textMask: {
          mask: [/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
          guide: false,
          keepCharPositions: true,
        }
      },
    });
  });

  beforeEach(() => {
    setupDirective();
  });

  it('process the typed value with the mask', () => {
    expect(spectator.directive).toBeTruthy();

    spectator.typeInElement('123456789', 'input');

    expect(spectator.hostComponent.form.value.name).toBe('123-45-6789');
  });
});
