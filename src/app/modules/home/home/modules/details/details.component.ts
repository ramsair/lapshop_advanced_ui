import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {
  productId: any;
  productDetails: any;

  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Get id from query params
    const urlParams = new URLSearchParams(window.location.search);
    this.productId = urlParams.get('id');

    if (this.productId != null) {
      this.getProductDetails(Number(this.productId));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Get product details by id
  getProductDetails(id: number) {
    this.apiService.getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response) {
            this.productDetails = response;
          }
        },
        (error) => {
          console.error('Failed to fetch product details', error);
        }
      );
  }

  onBuyClick() {
    this.router.navigate(['home/settlement'], { queryParams: { id: this.productId } });
  }
}