import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  products: any;
  displayedProducts: any;

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
    this.apiService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response && response.length > 0) {
            this.products = response;
            this.displayedProducts = this.products.slice(0, 4); // Display first 4 products
          }
        },
        (error) => {
          console.error('Failed to fetch products', error);
        }
      );
  }

  onMobileClicked(id: number) {
    // Add the id to query params
    this.router.navigate(['home/details'], { queryParams: { id: id } });
  }

  showNow() {
    this.router.navigate(['home/phones']);
  }

  myOrders() {
    this.router.navigate(['home/orders']);
  }

  addToCart(event: Event, productId: number) {
    event.stopPropagation();

    const user = localStorage.getItem('user');
    let payload: any = null;

    if (user) {
      const parsedUser = JSON.parse(user);
      payload = { user_id: parsedUser?.user?.id, product_id: productId };
    }

    if (payload) {
      this.apiService.addToCart(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            this.toastr.success('Product added successfully!', 'Success');
          },
          (error) => {
            this.toastr.error('Failed to add product to cart.', 'Error');
            console.error('Failed to add to cart', error);
          }
        );
    } else {
      this.toastr.warning('User not logged in.', 'Warning');
    }
  }
}