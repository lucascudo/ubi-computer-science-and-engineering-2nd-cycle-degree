import { Component } from '@angular/core';

import { AuthService } from 'src/app/core/services/auth.service';
import { LoginData } from 'src/app/core/interfaces/login-data.interface';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent {
  isDisabled: boolean = false;

  constructor(private readonly authService: AuthService) {}

  register(data: LoginData) {
    this.isDisabled = true;
    this.authService
      .register(data)
      .catch((e) => alert(e.message))
      .finally(() => this.isDisabled = false);
  }
}
