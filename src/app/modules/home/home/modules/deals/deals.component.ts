import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit, OnDestroy {
  products: any;

  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProducts() {
    this.apiService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response && response.length > 0) {
            this.products = response;
          }
        },
        (error) => {
          console.error('Failed to fetch products', error);
        }
      );
  }

  onMobileClicked(id: number) {
    // add the id to query params
    this.router.navigate(['home/details'], { queryParams: { id: id } });
  }
}