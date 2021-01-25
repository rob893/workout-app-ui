import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  public status = 200;

  public delay = 0;

  public statusAfter = 200;

  public per = 0;

  private readonly userService: UserService;

  public constructor(userService: UserService) {
    this.userService = userService;
  }

  public test(): void {
    this.userService.test(this.status, this.delay, this.statusAfter, this.per).subscribe(res => {
      console.log(res);
    });
  }

  public test2(): void {
    this.userService.getUser(1).subscribe(res => {
      console.log(res);
    });
  }
}
