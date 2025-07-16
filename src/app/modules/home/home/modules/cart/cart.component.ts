import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  products: any;

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCartItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // API to get cart items by user id
  getCartItems() {
    const user = localStorage.getItem('user');
    let payload: any = null;

    if (user) {
      const parsedUser = JSON.parse(user);
      payload = {
        user_id: parsedUser?.user?.id
      };
    }

    if (payload) {
      this.apiService.getCartItems(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            if (response) {
              this.products = response;
            }
          },
          (error) => {
            console.error('Failed to fetch cart items', error);
          }
        );
    }
  }

  onMobileClicked(id: number) {
    this.router.navigate(['home/details'], { queryParams: { id: id } });
  }

  onBuyClick(productId: any) {
    this.router.navigate(['home/settlement'], { queryParams: { id: productId } });
  }

  removeFromCart(event: any, productId: number) {
    event.stopPropagation();

    const user = localStorage.getItem('user');
    let payload: any = null;

    if (user) {
      const parsedUser = JSON.parse(user);
      payload = {
        user_id: parsedUser?.user?.id,
        product_id: productId
      };
    }

    if (payload) {
      this.apiService.removeCartItem(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.toastr.success('Product removed from cart successfully', 'Success');
            this.getCartItems(); // Refresh cart
          },
          (error) => {
            this.toastr.error('Failed to remove product from cart', 'Error');
            console.error('Failed to remove product from cart', error);
          }
        );
    }
  }
}