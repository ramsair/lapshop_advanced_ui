import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnDestroy {
  @Output() registerUser = new EventEmitter<any>();

  registerForm: FormGroup;
  submitted = false;

  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' }
  ];

  // Subject to manage unsubscribing
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnDestroy(): void {
    // Signal that the component is destroyed
    this.destroy$.next();
    // Complete the subject to avoid memory leaks
    this.destroy$.complete();
  }

  // Custom Validator: Check if password and confirmPassword match
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      // API call to create user
      this.apiService.addUser(this.registerForm.value)
        .pipe(takeUntil(this.destroy$)) // <-- added takeUntil
        .subscribe(
          (response) => {
            this.toastr.success('Registration Successful', 'Success');
            this.router.navigate(['/login']);
          },
          (error) => {
            this.toastr.error('Registration Failed', 'Error');
            console.error(error);
          }
        );

      // Remove alert in favor of Toastr
      // alert("Registration Successful!");
    } else {
      this.toastr.error('Please fill the form correctly.', 'Validation Error');
    }
  }

  onBackClick() {
    this.router.navigate(['/login']);
  }
}