import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent {
  @Output()
  public closeSidenav = new EventEmitter<void>();

  public isAuth = false;

  public onLogout(): void {
    this.onClose();
  }

  public onClose(): void {
    this.closeSidenav.emit();
  }
}
