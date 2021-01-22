import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  private readonly userService: UserService;

  public constructor(userService: UserService) {
    this.userService = userService;
  }

  public test(): void {
    this.userService.getUsers().subscribe(res => {
      console.log(res);
    });
  }
}
