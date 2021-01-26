import { ValidatorFn, AbstractControl } from '@angular/forms';

export class AppValidators {
  public static matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const matchToValue = control.parent?.get(matchTo);
      return control?.value === matchToValue?.value ? null : { isMatching: true };
    };
  }
}
