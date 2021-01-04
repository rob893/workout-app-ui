import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HeaderComponent } from './components/header/header.component';
import { SidenavListComponent } from './components/sidenav-list/sidenav-list.component';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { ThemePickerModule } from './components/theme-picker/theme-picker.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { JwtModule, JWT_OPTIONS, JwtConfig } from '@auth0/angular-jwt';
import { EnvironmentService } from './services/environment.service';

function jwtOptionsFactory(authService: AuthService, envService: EnvironmentService): JwtConfig {
  return {
    tokenGetter: authService.getAccessToken,
    allowedDomains: envService.allowedHosts
  };
}

@NgModule({
  declarations: [AppComponent, HeaderComponent, SidenavListComponent, WelcomeComponent],
  imports: [
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService, EnvironmentService]
      }
    }),
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ThemePickerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
