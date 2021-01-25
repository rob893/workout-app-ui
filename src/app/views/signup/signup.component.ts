import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { SignUpForm } from 'src/app/core/models/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoggerService } from 'src/app/core/services/logger.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  public loading = false;

  public readonly signupForm: FormGroup;

  private readonly logger: LoggerService;

  private readonly authService: AuthService;

  private readonly router: Router;

  public constructor(authService: AuthService, router: Router, formBuilder: FormBuilder, logger: LoggerService) {
    this.authService = authService;
    this.router = router;
    this.logger = logger;

    this.signupForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  public get formValue(): SignUpForm {
    return this.signupForm.value;
  }

  public signup(): void {
    if (this.loading) {
      return;
    }

    if (!this.signupForm.valid) {
      this.logger.error(
        `${SignupComponent.name}.${this.signup.name}: Signup attempted with invalid form.`,
        this.formValue
      );
    }

    this.authService
      .registerUser(this.formValue)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        error => {
          this.logger.error(error);
        }
      );
  }

  public clearSignupForm(): void {
    this.signupForm.reset();
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const matchToValue = control.get(matchTo);
      return control?.value === matchToValue?.value ? null : { isMatching: true };
    };
  }
}
