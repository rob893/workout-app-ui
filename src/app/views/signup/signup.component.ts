import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AppValidators } from 'src/app/core/AppValidators';
import { LinkedAccountType } from 'src/app/core/models/entities';
import { SignUpForm } from 'src/app/core/models/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { GoogleAuthService } from 'src/app/core/services/google-auth.service';
import { LoggerService } from 'src/app/core/services/logger.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public loading = false;

  public socialLogin: LinkedAccountType | null = null;

  public readonly signupForm: FormGroup;

  public readonly signupUsingGoogleAccountForm: FormGroup;

  private readonly logger: LoggerService;

  private readonly authService: AuthService;

  private readonly googleAuthService: GoogleAuthService;

  private readonly router: Router;

  private readonly route: ActivatedRoute;

  public constructor(
    authService: AuthService,
    googleAuthService: GoogleAuthService,
    router: Router,
    route: ActivatedRoute,
    formBuilder: FormBuilder,
    logger: LoggerService
  ) {
    this.authService = authService;
    this.googleAuthService = googleAuthService;
    this.router = router;
    this.route = route;
    this.logger = logger;

    this.signupForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, AppValidators.matchValues('password')]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required]
    });

    this.signupUsingGoogleAccountForm = formBuilder.group({
      idToken: ['', Validators.required],
      username: ['', Validators.required]
    });
  }

  public get signUpFormValue(): SignUpForm {
    return this.signupForm.value;
  }

  public get signUpGoogleFormValue(): { idToken: string; username: string } {
    return this.signupUsingGoogleAccountForm.value;
  }

  public ngOnInit(): void {
    this.socialLogin = this.route.snapshot.queryParams.socialLogin || null;

    if (
      this.socialLogin === LinkedAccountType.Google &&
      this.googleAuthService.isSignedIn &&
      this.googleAuthService.currentUser
    ) {
      const currentUser = this.googleAuthService.currentUser;

      this.signupUsingGoogleAccountForm.setValue({
        idToken: currentUser.getAuthResponse().id_token,
        username: currentUser.getBasicProfile().getEmail()?.split('@')[0]
      });
    }
  }

  public signup(): void {
    if (this.loading) {
      return;
    }

    if (!this.signupForm.valid) {
      this.logger.error(
        `${SignupComponent.name}.${this.signup.name}: Signup attempted with invalid form.`,
        this.signUpFormValue
      );
    }

    this.loading = true;

    this.authService
      .registerUser(this.signUpFormValue)
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

  public registerUsingGoogleAccount(): void {
    const { username, idToken } = this.signUpGoogleFormValue;

    if (!this.signupUsingGoogleAccountForm.valid || !idToken || !username) {
      return;
    }

    this.loading = true;

    this.authService
      .registerUserUsingGoogleAccount(username, idToken)
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

  public clearSignupUsingGoogleForm(): void {
    this.signupUsingGoogleAccountForm.reset();
  }
}
