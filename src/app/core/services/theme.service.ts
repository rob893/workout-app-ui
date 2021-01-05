import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public readonly isDarkTheme = new Subject<boolean>();

  public setDarkTheme(isDarkTheme: boolean): void {
    this.isDarkTheme.next(isDarkTheme);
  }
}
