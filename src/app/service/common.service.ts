import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(private http: HttpClient,
        private router: Router,
    ) { }


    onMobileClicked(id: number) {
        this.router.navigate(['home/details'], { queryParams: { id: id } });
    }
}
