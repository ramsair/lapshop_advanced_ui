import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() loginUser = new EventEmitter<any>();
  @Output() registerUserClicked = new EventEmitter<any>();

  loginForm: FormGroup;
  submitted = false;

  // Subject to manage unsubscribing
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
    }
  }

  ngOnDestroy(): void {
    // Signal that the component is destroyed
    this.destroy$.next();
    // Complete the subject to avoid memory leaks
    this.destroy$.complete();
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      // Api call to login user
      this.apiService.loginUser(this.loginForm.value)
        .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe on destroy
        .subscribe(
          (response) => {
            // Toster message
            this.toastr.success('Login Successful', 'Success');

            // Store user data in local storage
            localStorage.setItem('user', JSON.stringify(response));

            if (response.user.role === 'admin') {
              this.router.navigate(['/admin', 'dashboard']);
            } else {
              this.router.navigate(['/home']);
            }
          },
          (error) => {
            this.toastr.error('Login failed. Please try again.', 'Error');
            console.error(error);
          }
        );
    }
  }

  onRegisterClick(event: MouseEvent) {
    this.registerUserClicked.emit(); // Emit event for parent handling (optional)
    this.router.navigate(['/register']);
  }
}