import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form:FormGroup;
  constructor(
    private fb:FormBuilder,
    private authService: AuthService,
    private router: Router) {

    this.form = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  register() {
    const val = this.form.value;
    if (val.email && val.password) {
      this.authService.register(val.email, val.password).subscribe({
        next: () => this.router.navigateByUrl('/login'),
        error: (error) => alert(error.error.message),
      });
    }
  }
}

