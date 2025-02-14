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

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductChartComponent],
})
export class ProductTableComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.productService
      .getProducts()
      .subscribe((products) => (this.products = products));
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
