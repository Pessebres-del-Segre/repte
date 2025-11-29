import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTabsModule,
    MatIconModule
  ],
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  hideLoginPassword = true;
  hideSignupPassword = true;
  hideSignupConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private router: Router,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { returnUrl?: string, mustLink: boolean }
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]], // Changed to allow username or email if backend supports it, but kept simple for now
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Send email and password to the backend
      this.authService.login({ email, password }).subscribe({
        next: (response: any) => {
          console.log('Login successful', response);
          this.dialogRef.close(true);
          console.log('returnUrl', this.data)
          // Navigate to returnUrl if present
          if (this.data?.returnUrl) {
            this.router.navigateByUrl(this.data.returnUrl);
          }
        },
        error: (error: any) => {
          console.error('Login failed', error);
          // Set Catalan error message
          if (error.status === 401 || error.status === 400) {
            this.loginForm.setErrors({ invalidCredentials: true });
            // You might want to display a specific message in the template based on this error
            // For now, we assume the template checks for 'invalidCredentials'
          } else {
            this.loginForm.setErrors({ serverError: true });
          }
        }
      });
    }
  }

  onSignupSubmit(): void {
    if (this.signupForm.valid) {
      const { username, name, email, password } = this.signupForm.value;
      const signupData = {
        username,
        email,
        password,
        first_name: name
      };

      this.authService.signup(signupData).subscribe({
        next: (response: any) => {
          console.log('Signup successful', response);
          this.dialogRef.close(true);
          console.log('returnUrl', this.data)
          if (this.data?.returnUrl) {
            this.router.navigateByUrl(this.data.returnUrl);
          }
        },
        error: (error: any) => {
          console.error('Signup failed', error);
          // Handle specific errors like "User already exists"
          if (error.error && (error.error.username || error.error.email)) {
            this.signupForm.setErrors({ userExists: true });
          } else {
            this.signupForm.setErrors({ signupFailed: true });
          }
        }
      });
    }
  }

  onGoogleLogin(): void {
    // Handle Google login logic here
    const returnUrl = this.data?.returnUrl || '/dashboard';
    window.location.href = `http://localhost:8000/auth/google/login/?process=login&next=${encodeURIComponent(returnUrl)}`;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
