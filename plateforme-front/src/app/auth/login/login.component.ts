// src/app/auth/login/login.component.ts
import { Component, OnInit }           from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators }     from '@angular/forms';
import { Router, RouterModule }                      from '@angular/router';
import { MatSnackBar, MatSnackBarModule }                 from '@angular/material/snack-bar';
import { AuthService, LoginPayload, }   from '../../services/auth.service';
import { MatButtonModule }          from '@angular/material/button';
import { MatCardModule }            from '@angular/material/card';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }            from '@angular/material/input';
import { CommonModule }             from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly snack: MatSnackBar,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    const payload = this.form.value  as LoginPayload;
    this.auth.login(payload).subscribe({
      next: (message: string) => {
        this.snack.open(message, '', { duration: 2000 });
        if (message === 'Connexion réussie') {
        // eventuellement stocker le user/token dans un service ou localStorage
        this.router.navigate(['/booking']);
      }
      },
      error: (err: string) => {
        this.snack.open(err, '', { duration: 4000 });
        this.isLoading = false;
      }
    });
  }
}
