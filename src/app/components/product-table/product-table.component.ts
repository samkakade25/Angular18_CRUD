import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductChartComponent } from '../product-chart/product-chart.component';
import { ProductChartNgxComponent } from '../product-chart-ngx/product-chart-ngx.component';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductChartComponent,
    ProductChartNgxComponent,
  ],
})
export class ProductTableComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;

    // Add default products if none exist
    const defaultProducts: Product[] = [
      {
        id: 1,
        name: 'Laptop',
        price: 999.99,
        quantity: 10,
        category: 'Electronics',
        description: 'High-performance laptop with latest specifications',
      },
      {
        id: 2,
        name: 'Smartphone',
        price: 599.99,
        quantity: 15,
        category: 'Electronics',
        description: 'Latest model smartphone with advanced features',
      },
      {
        id: 3,
        name: 'Headphones',
        price: 199.99,
        quantity: 20,
        category: 'Accessories',
        description: 'Wireless noise-canceling headphones',
      },
      {
        id: 4,
        name: 'Smart Watch',
        price: 299.99,
        quantity: 12,
        category: 'Wearables',
        description: 'Fitness tracking and health monitoring smartwatch',
      },
    ];

    this.productService.getProducts().subscribe({
      next: (products) => {
        // If no products exist, add default ones
        if (products.length === 0) {
          defaultProducts.forEach((product) => {
            this.productService.addProduct(product);
          });
          this.products = defaultProducts;
        } else {
          this.products = products;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.isLoading = false;
        console.error('Error loading products:', err);
      },
    });

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.isLoading = false;
        console.error('Error loading products:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      if (this.isEditing && this.editingId) {
        const updatedProduct: Product = {
          id: this.editingId,
          ...this.productForm.value,
        };
        this.productService.updateProduct(updatedProduct);
      } else {
        this.productService.addProduct(this.productForm.value);
      }
      this.resetForm();
    }
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.editingId = product.id ?? null;
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      description: product.description,
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id);
    }
  }

  resetForm(): void {
    this.productForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }

  // Helper method to check form field validity
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
