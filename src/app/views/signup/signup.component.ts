import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  public constructor(logger: LoggerService) {
    this.logger = logger;

    this.signupForm = new FormGroup({
      username: new FormControl('', {
        validators: [Validators.required]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  public signup(): void {
    this.logger.info('Signing up...');
  }

  public clearSignupForm(): void {
    this.signupForm.reset();
  }
}
