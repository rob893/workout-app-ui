import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { GoogleAuthService } from 'src/app/core/services/google-auth.service';
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

  private readonly googleAuthService: GoogleAuthService;

  private readonly formBuilder: FormBuilder;

  public constructor(authService: AuthService, googleAuthService: GoogleAuthService, formBuilder: FormBuilder) {
    this.authService = authService;
    this.googleAuthService = googleAuthService;
    this.formBuilder = formBuilder;

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public login(): void {
    if (this.loading) {
      return;
    }

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

  public async googleLogin(): Promise<void> {
    this.loading = true;

    try {
      const googleUser = await this.googleAuthService.signIn();
      const idToken = googleUser.getAuthResponse().id_token;
      await this.authService.loginGoogle(idToken).toPromise();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  public clearLoginForm(): void {
    this.loginForm.reset();
  }
}
