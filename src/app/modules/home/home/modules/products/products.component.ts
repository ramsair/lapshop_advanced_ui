import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: any;
  filteredProducts: any[] = []; // Filtered products based on category
  selectedCategory = '';

  categories = [
    { label: 'All', value: 'all' },
    { label: 'Gaming Laptops', value: 'gamingLaptops' },
    { label: 'Ultrabooks', value: 'ultrabooks' },
    { label: 'Budget Laptops', value: 'budgetLaptops' },
    { label: 'Business Laptops', value: 'businessLaptops' },
    { label: '2-in-1 Laptops', value: 'twoInOneLaptops' },
    { label: 'MacBooks', value: 'macbooks' },
    { label: 'Workstation Laptops', value: 'workstationLaptops' },
    { label: 'Chromebooks', value: 'chromebooks' },
    { label: 'Refurbished Laptops', value: 'refurbishedLaptops' },
    { label: 'Touchscreen Laptops', value: 'touchscreenLaptops' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.checkNetworkAndBattery();
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkNetworkAndBattery() {
    const nav = navigator as any;
    if (nav.connection?.effectiveType === '4g' && nav.getBattery) {
      nav.getBattery().then((battery: any) => {
        if (battery.level > 0.5) {
          this.getProducts(); // Only fetch products if conditions are met
        }
      });
    }
  }

  getProducts() {
    this.apiService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response && response.length > 0) {
            this.products = response;
            this.filteredProducts = [...response]; // Initially show all products
          }
        },
        (error) => {
          console.error('Failed to fetch products', error);
          this.toastr.error('Could not load products.', 'Error');
        }
      );
  }

  // Filter products based on selected category
  filterProducts() {
    if (this.selectedCategory === '' || this.selectedCategory === 'all') {
      this.filteredProducts = this.products; // Show all
    } else {
      this.filteredProducts = this.products.filter(
        (product: any) => product.category === this.selectedCategory
      );
    }
  }

  onMobileClicked(id: number) {
    this.router.navigate(['home/details'], { queryParams: { id: id } });
  }

  addToCart(event: Event, productId: number) {
    event.stopPropagation();

    let user = localStorage.getItem('user');
    let payload: any;

    if (user) {
      const parsedUser = JSON.parse(user);
      payload = { user_id: parsedUser?.user?.id, product_id: productId };
    }

    if (payload) {
      this.apiService.addToCart(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.toastr.success('Product added successfully!', 'Success');
          },
          (error) => {
            console.error('Failed to add product to cart', error);
            this.toastr.error('Failed to add product to cart.', 'Error');
          }
        );
    }
  }
}