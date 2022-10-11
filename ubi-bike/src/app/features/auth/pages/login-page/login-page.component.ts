import { Component } from '@angular/core';

import { AuthService } from 'src/app/core/services/auth.service';
import { LoginData } from 'src/app/core/interfaces/login-data.interface';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  isDisabled: boolean = false;

  constructor(private readonly authService: AuthService) {}

  login(loginData: LoginData) {
    this.isDisabled = true;
    this.authService.login(loginData).finally(() => this.isDisabled = false);
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
