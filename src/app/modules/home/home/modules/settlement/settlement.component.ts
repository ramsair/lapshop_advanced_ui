import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.css']
})
export class SettlementComponent implements OnInit, OnDestroy {
  deliveryAddress: string = '';
  city: string = '';
  postalCode: string = '';
  phone: string = '';
  quantity: number = 1; // Default quantity
  cartItems = [
    { name: 'Product 1', price: 100, quantity: 1 },
    { name: 'Product 2', price: 200, quantity: 2 }
  ];

  // Payment details
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  productDetails: any;
  productId!: any;
  isOrderPlaced: boolean = false;
  totalPrice: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.productId = urlParams.get('id');
    this.getProductDetails(this.productId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmitDelivery() {
    // Handle delivery form submission logic here
  }

  onSubmitPayment() {
    // Validate all fields
    if (
      !this.deliveryAddress ||
      !this.city ||
      !this.postalCode ||
      !this.phone ||
      !this.cardNumber ||
      !this.expiryDate ||
      !this.cvv
    ) {
      this.toastr.warning('Please fill all the fields', 'Missing Info');
      return;
    }

    let user = localStorage.getItem('user');
    let payload: any;

    if (user) {
      const parsedUser = JSON.parse(user);
      payload = {
        user_id: parsedUser?.user?.id,
        product_id: this.productId,
        price: this.totalPrice,
        order_date: new Date(),
        order_status: 'Pending',
        address: this.deliveryAddress,
        delivery_address: this.deliveryAddress,
        city: this.city,
        postal_code: this.postalCode,
        phone_number: this.phone,
        card_number: this.cardNumber,
        expiry_date: this.expiryDate,
        cvv: this.cvv,
        quantity: this.quantity
      };
    }

    this.apiService.placeOrder(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response) {
            this.isOrderPlaced = true;
            this.toastr.success('Order placed successfully!', 'Success');
            this.router.navigate(['home/orders'], { queryParams: { id: this.productId } });
          }
        },
        (error) => {
          this.toastr.error('Failed to place order.', 'Error');
          console.error('Failed to place order', error);
        }
      );
  }

  getProductDetails(id: number) {
    this.apiService.getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response) {
            this.productDetails = response;
            this.updateTotalPrice();
          }
        },
        (error) => {
          console.error('Failed to fetch product details', error);
          this.toastr.error('Could not load product details.', 'Error');
        }
      );
  }

  increaseQuantity() {
    this.quantity += 1;
    this.updateTotalPrice();
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
      this.updateTotalPrice();
    }
  }

  updateTotalPrice() {
    this.totalPrice = this.quantity * (this.productDetails.price - this.productDetails.price * 0.1);
  }
}