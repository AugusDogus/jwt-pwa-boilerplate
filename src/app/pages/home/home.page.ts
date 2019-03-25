import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  data = 'This is super secret information available only to members.';

  constructor(
      private authService: AuthService
  ) {}

  logout() {
    this.authService.logout();
  }

}
