import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  products: any;
  dashboardData: any;
  editTable: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getLatestOrders();
    this.getDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // API to get latest orders
  getLatestOrders() {
    this.apiService.getLatestOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response && response.length > 0) {
            this.products = response.map((item: any) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              status: item.status,
              isEditClicked: false,
              order_status: item.order_status
            }));
          }
        },
        (error) => {
          console.error('Failed to fetch products', error);
        }
      );
  }

  // Update order status
  editStatus(id: number) {
    const order = this.products.find((item: any) => item.id === id);
    if (order) {
      order.isEditClicked = true;
    }
  }

  updateOrderStatus(id: number, status: string) {
    const payload = {
      order_status: status,
      id: id
    };

    this.apiService.updateOrderStatus(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response) {
            this.getLatestOrders();
            this.toastr.success('Order status updated successfully');
          }
        },
        (error) => {
          this.toastr.error('Failed to update order status');
          console.error('Failed to update order status', error);
        }
      );
  }

  // Get dashboard data
  getDashboardData() {
    this.apiService.getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response) {
            this.dashboardData = response;
          }
        },
        (error) => {
          console.error('Failed to fetch dashboard data', error);
        }
      );
  }
}