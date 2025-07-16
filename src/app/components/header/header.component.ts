import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private toastr: ToastrService

  ) { }

  isAdmin: boolean = false;
  ngOnInit(): void {

    // get the logged in user data from local storage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user: any = JSON.parse(userData);
      if (user.user.role === 'admin') {
        this.isAdmin = true;
      }
      else {
        this.isAdmin = false;
      }
     
    }
  }
  onLogOutClick() {
    // remove user data from local storage
    localStorage.removeItem('user');
    this.toastr.success('Logged Out Successfully!', 'Success');
    window.location.reload();
  }
}
