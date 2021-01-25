import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LinkedAccountType } from 'src/app/core/models/entities';
import { HttpStatusCode } from 'src/app/core/models/http';
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

  private readonly router: Router;

  public constructor(
    authService: AuthService,
    googleAuthService: GoogleAuthService,
    formBuilder: FormBuilder,
    router: Router
  ) {
    this.authService = authService;
    this.googleAuthService = googleAuthService;
    this.router = router;

    this.loginForm = formBuilder.group({
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
          this.router.navigateByUrl('/');
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
      if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.NotFound) {
        this.router.navigate(['/signup'], { queryParams: { socialLogin: LinkedAccountType.Google } });
      }
    } finally {
      this.loading = false;
    }
  }

  public clearLoginForm(): void {
    this.loginForm.reset();
  }
}
