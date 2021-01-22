import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EMPTY, from, Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { LoginResponse, RefreshTokenResponse, RegisterResponse, RegisterUserDto } from '../models/dtos';
import { User } from '../models/entities';
import { EnvironmentService } from './environment.service';
import { LocalStorageService } from './local-storage.service';
import { LoggerService } from './logger.service';
import { WorkoutAppBaseService } from './workout-app-base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends WorkoutAppBaseService {
  public readonly authChanged: Subject<boolean> = new Subject();

  public readonly unauthorizedActionAttempted: Subject<number> = new Subject();

  private readonly localStorageService: LocalStorageService;

  private readonly jwtHelperService: JwtHelperService;

  private readonly accessTokenStorageKey: string = 'access-token';

  private readonly refreshTokenStorageKey: string = 'refresh-token';

  private readonly deviceIdStorageKey: string = 'device-id';

  private readonly userStorageKey: string = 'user';

  private cachedAccessToken: string | null = null;

  private cachedRefreshToken: string | null = null;

  private cachedDeviceId: string | null = null;

  private cachedLoggedInUser: User | null = null;

  public constructor(
    httpClient: HttpClient,
    localStorageService: LocalStorageService,
    environment: EnvironmentService,
    logger: LoggerService
  ) {
    super(httpClient, environment, logger);

    this.localStorageService = localStorageService;
    this.jwtHelperService = new JwtHelperService();
  }

  public get isUserLoggedIn(): boolean {
    return this.loggedInUser !== null;
  }

  public get loggedInUser(): User | null {
    if (!this.cachedLoggedInUser) {
      const userFromLocalStorage = this.localStorageService.getParsedItem<User>(this.userStorageKey);

      if (!userFromLocalStorage) {
        return null;
      }

      this.cachedLoggedInUser = userFromLocalStorage;
    }

    return { ...this.cachedLoggedInUser };
  }

  private get accessToken(): string | null {
    if (!this.cachedAccessToken) {
      const tokenFromLocalStorage = this.localStorageService.getItem(this.accessTokenStorageKey);

      if (!tokenFromLocalStorage) {
        return null;
      }

      this.cachedAccessToken = tokenFromLocalStorage;
    }

    return this.cachedAccessToken;
  }

  private get refreshToken(): string | null {
    if (!this.cachedRefreshToken) {
      const tokenFromLocalStorage = this.localStorageService.getItem(this.refreshTokenStorageKey);

      if (!tokenFromLocalStorage) {
        return null;
      }

      this.cachedRefreshToken = tokenFromLocalStorage;
    }

    return this.cachedRefreshToken;
  }

  private get deviceId(): string {
    if (!this.cachedDeviceId) {
      const deviceIdFromLocalStorage = this.localStorageService.getItem(this.deviceIdStorageKey);

      if (!deviceIdFromLocalStorage) {
        this.cachedDeviceId = uuid();
        this.localStorageService.setItem(this.deviceIdStorageKey, this.cachedDeviceId);
      } else {
        this.cachedDeviceId = deviceIdFromLocalStorage;
      }
    }

    return this.cachedDeviceId;
  }

  public registerUser(registerUserDto: RegisterUserDto): Observable<RegisterResponse> {
    return this.httpClient
      .post<RegisterResponse>(`${this.baseUrl}/auth/register`, {
        ...registerUserDto,
        deviceId: this.deviceId
      })
      .pipe(
        map(response => {
          this.handleLoginOrRegisterResponse(response);

          return response;
        })
      );
  }

  public registerUserUsingGoogleAccount(username: string, idToken: string): Observable<RegisterResponse> {
    return this.httpClient
      .post<RegisterResponse>(`${this.baseUrl}/auth/register/google`, {
        username,
        idToken,
        deviceId: this.deviceId
      })
      .pipe(
        map(response => {
          this.handleLoginOrRegisterResponse(response);

          return response;
        })
      );
  }

  public login(username: string, password: string): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${this.baseUrl}/auth/login`, {
        username,
        password,
        deviceId: this.deviceId
      })
      .pipe(
        map(response => {
          this.handleLoginOrRegisterResponse(response);

          return response;
        })
      );
  }

  public loginGoogle(idToken: string): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${this.baseUrl}/auth/login/google`, {
        idToken,
        deviceId: this.deviceId
      })
      .pipe(
        map(response => {
          this.handleLoginOrRegisterResponse(response);

          return response;
        })
      );
  }

  public logout(): void {
    this.localStorageService.clear();
    this.cachedDeviceId = null;
    this.cachedAccessToken = null;
    this.cachedRefreshToken = null;
    this.cachedLoggedInUser = null;
    this.authChanged.next(false);
  }

  public getAccessToken(): Observable<string | null> {
    if (!this.accessToken) {
      this.logger.debug('Access token is null.');
      return EMPTY;
    }

    if (this.isTokenExpired(this.accessToken)) {
      this.logger.debug('Access token is expired. Refreshing.');
      return this.refreshAccessToken().pipe(map(res => res.token));
    }

    this.logger.debug('Returning cached access token.');
    return from(this.accessToken);
  }

  public refreshAccessToken(): Observable<RefreshTokenResponse> {
    this.logger.debug('Refreshing access token.');
    return this.httpClient
      .post<RefreshTokenResponse>(`${this.baseUrl}/auth/refreshToken`, {
        token: this.accessToken,
        refreshToken: this.refreshToken,
        deviceId: this.deviceId
      })
      .pipe(
        map(response => {
          this.logger.debug('Access token refreshed.');
          const { token, refreshToken } = response;

          this.cachedAccessToken = token;
          this.cachedRefreshToken = refreshToken;

          this.localStorageService.setItem(this.accessTokenStorageKey, token);
          this.localStorageService.setItem(this.refreshTokenStorageKey, refreshToken);

          return response;
        })
      );
  }

  public isTokenExpired(token: string, expOffsetInSeconds: number = 300): boolean {
    return this.jwtHelperService.isTokenExpired(token, expOffsetInSeconds);
  }

  private handleLoginOrRegisterResponse({ token, refreshToken, user }: LoginResponse | RegisterResponse): void {
    this.cachedAccessToken = token;
    this.cachedRefreshToken = refreshToken;
    this.cachedLoggedInUser = user;

    this.localStorageService.setItem(this.accessTokenStorageKey, token);
    this.localStorageService.setItem(this.refreshTokenStorageKey, refreshToken);
    this.localStorageService.setItem(this.userStorageKey, user);

    this.authChanged.next(true);
  }
}
