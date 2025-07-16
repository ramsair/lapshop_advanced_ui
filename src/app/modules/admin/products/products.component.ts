import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare var bootstrap: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild('addProductModal') modalRef: any;

  products: any[] = [];
  selectedFile: any;
  localImageUrl!: string;
  selectedCategory: string = '';
  addProductForm!: FormGroup;
  operation: string = 'ADD';
  currentIndex!: number;

  // Categories
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
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.addProductForm = this.fb.group({
      productImage: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(1)]],
      inTheBox: [''],
      modelNumber: [''],
      processorBrand: [''],
      processorType: [''],
      ram: [''],
      internalStorage: [''],
      operatingSystem: [''],
      displaySize: [''],
      resolution: [''],
      batteryCapacity: [''],
      graphicsCard: [''],
      ports: [''],
      weight: [''],
      dimensions: [''],
      touchscreen: [''],
      backlitKeyboard: [''],
      fingerprintSensor: [''],
      webcam: [''],
      warrantySummary: [''],
      color: ['']
    });

    this.getProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeModal() {
    const cancelBtn = document.querySelector('[data-bs-dismiss="modal"]');
    if (cancelBtn) {
      cancelBtn.dispatchEvent(new MouseEvent('click'));
    }
  }

  updateCategory(event: any) {
    this.newProduct.category = event.target.value;
  }

  get newProduct() {
    return {
      image_url: '',
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 1
    };
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.apiService.uploadImage(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response: any) => {
            this.newProduct.image_url = response.imageUrl;
            this.addProductForm.patchValue({
              productImage: response.imageUrl
            });
          },
          (error) => {
            console.error('Image upload failed', error);
          }
        );
    }
  }

  addProduct() {
    if (this.addProductForm.valid) {
      const productData = {
        name: this.addProductForm.get('name')?.value,
        description: this.addProductForm.get('description')?.value,
        price: this.addProductForm.get('price')?.value,
        category: this.addProductForm.get('category')?.value,
        stock: this.addProductForm.get('stock')?.value,
        image_url: this.newProduct.image_url,
        additionalJson: this.addProductForm.value
      };

      if (
        productData.name &&
        productData.price > 0 &&
        productData.stock > 0 &&
        productData.image_url &&
        productData.category
      ) {
        this.apiService.addProduct(productData)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (response) => {
              this.toastr.success('Product added successfully!', 'Success');
              this.getProducts();
              this.addProductForm.reset();
              this.closeModal();
            },
            (error) => {
              this.toastr.error('Failed to add product.', 'Error');
              console.error(error);
            }
          );
      } else {
        this.toastr.warning('Please fill in all fields.');
      }
    } else {
      this.toastr.warning('Form is invalid. Please fill in all required fields.');
    }
  }

  getProducts() {
    this.apiService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.products = response;
        },
        (error) => {
          console.error('Failed to fetch products', error);
        }
      );
  }

  removeProduct(index: number, productId: number) {
    this.apiService.removeProduct(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.products.splice(index, 1);
          this.toastr.success('Product removed successfully!', 'Success');
        },
        (error) => {
          console.error('Failed to remove product', error);
          this.toastr.error('Failed to remove product', 'Error');
        }
      );
  }

  updateProduct() {
    const index = this.currentIndex;
    const updatedProduct = this.products[index];

    if (this.addProductForm.valid) {
      const productData = {
        name: this.addProductForm.get('name')?.value,
        description: this.addProductForm.get('description')?.value,
        price: this.addProductForm.get('price')?.value,
        category: this.addProductForm.get('category')?.value,
        stock: this.addProductForm.get('stock')?.value,
        image_url: this.newProduct.image_url,
        additionalJson: this.addProductForm.value
      };

      this.apiService.updateProduct(this.currentIndex, productData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            this.toastr.success('Product updated successfully!', 'Success');
            this.getProducts();
            this.closeModal();
          },
          (error) => {
            console.error('Failed to update product', error);
            this.toastr.error('Failed to update product', 'Error');
          }
        );
    }
  }

  editProduct(product_id: number) {
    this.currentIndex = product_id;
    this.operation = 'EDIT';
    const product = this.products.find((p) => p.id === product_id);

    if (product) {
      this.addProductForm.patchValue({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        productImage: product.image_url,

        inTheBox: product.additionalJson?.inTheBox,
        modelNumber: product.additionalJson?.modelNumber,
        processorBrand: product.additionalJson?.processorBrand,
        processorType: product.additionalJson?.processorType,
        ram: product.additionalJson?.ram,
        internalStorage: product.additionalJson?.internalStorage,
        operatingSystem: product.additionalJson?.operatingSystem,
        displaySize: product.additionalJson?.displaySize,
        resolution: product.additionalJson?.resolution,
        batteryCapacity: product.additionalJson?.batteryCapacity,
        graphicsCard: product.additionalJson?.graphicsCard,
        ports: product.additionalJson?.ports,
        weight: product.additionalJson?.weight,
        dimensions: product.additionalJson?.dimensions,
        touchscreen: product.additionalJson?.touchscreen,
        backlitKeyboard: product.additionalJson?.backlitKeyboard,
        fingerprintSensor: product.additionalJson?.fingerprintSensor,
        webcam: product.additionalJson?.webcam,
        warrantySummary: product.additionalJson?.warrantySummary,
        color: product.additionalJson?.color
      });
    }
  }
}