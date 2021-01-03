import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public readonly title = 'workout-app-ui';

  public isDarkTheme = false;

  private readonly sub: Subscription;

  public constructor(private themeService: ThemeService) {
    this.sub = this.themeService.isDarkTheme.subscribe(isDarkTheme => {
      this.isDarkTheme = isDarkTheme;
    });
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
