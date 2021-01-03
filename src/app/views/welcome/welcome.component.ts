import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  public test(): void {
    (document.getElementById('themeAsset') as any).href =
      'node_modules/@angular/material/prebuilt-themes/indigo-pink.css';
  }
}
