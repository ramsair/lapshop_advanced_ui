import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  products: any;

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProducts() {
    this.apiService.getOrderedProduct()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response && response.length > 0) {
            this.products = response;
          }
        },
        (error) => {
          console.error('Failed to fetch orders', error);
          this.toastr.error('Could not load your orders.', 'Error');
        }
      );
  }

  onMobileClicked(id: number) {
    this.router.navigate(['home/details'], { queryParams: { id: id } });
  }
}