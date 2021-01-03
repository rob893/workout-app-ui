import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output()
  public readonly sidenavToggle = new EventEmitter<void>();

  public readonly themeService: ThemeService;

  public isDarkTheme!: Observable<boolean>;

  public isAuth = false;

  public constructor(themeService: ThemeService) {
    this.themeService = themeService;
  }

  public ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
  }

  public toggleDarkTheme(checked: boolean): void {
    this.themeService.setDarkTheme(checked);
  }

  public onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }
}
