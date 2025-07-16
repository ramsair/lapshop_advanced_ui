import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mobile-mart';
  // isUserRegistration: boolean = false;
  // onRegisterClick: boolean = false;
  // isUserLoggined : boolean = false;
  // currentUrl!: string;
  

  constructor(
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService

  ) {}

  ngOnInit(): void {      

    // Subscribe to router events to get the current URL
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.currentUrl = event.url;
    
    //   }
    // });

    // const userData = localStorage.getItem('user');
    // if(this.currentUrl == '/login') {
    //   localStorage.removeItem('user');
    //   this.isUserLoggined = false;
    // }
    // else if (userData && this.currentUrl !== '/login') {
    //   // remove user data from local storage
    //   this.isUserLoggined = true;
    // }

    
  }


  // updateUserRegistation(event: any) {
  //   this.isUserRegistration = event;
  //   this.onRegisterClick = false;

  // }
  // onLoginClicked(event: any) {
  //   this.isUserLoggined = true;

  // // get the logged in user data from local storage
  //   const userData = localStorage.getItem('user');    
  //   if (userData) {
  //     const user : any = JSON.parse(userData);


  //     if(user.user.role === 'admin') {
  //       // route to admin page
  //       this.router.navigate(['admin','dashboard']);
  //     }
  //     else {
  //       // route to user page
  //       this.router.navigate(['home']);
  //     }

  //   }
  // }
  // onRegisterUser(event: any) {
  //   this.isUserRegistration = event;
  //   this.onRegisterClick = true;
 
  // }
}
