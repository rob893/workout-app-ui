import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loading = false;

  public readonly loginForm: FormGroup;

  private readonly authService: AuthService;

  public constructor(authService: AuthService) {
    this.authService = authService;

    this.loginForm = new FormGroup({
      username: new FormControl('', {
        validators: [Validators.required]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  public login(): void {
    this.loading = true;
    this.authService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        successRes => {
          console.log(successRes);
        },
        error => {
          console.log(error);
        }
      );
  }

  public clearLoginForm(): void {
    this.loginForm.reset();
  }
}
