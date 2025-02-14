import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [];
  private productsSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    // Initialize with some sample data
    this.products = [
      {
        id: 1,
        name: 'Laptop',
        price: 999.99,
        category: 'Electronics',
        description: 'High-performance laptop',
      },
      {
        id: 2,
        name: 'Desk Chair',
        price: 199.99,
        category: 'Furniture',
        description: 'Ergonomic office chair',
      },
    ];
    this.productsSubject.next(this.products);
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  addProduct(product: Product): void {
    const newProduct = {
      ...product,
      id: this.products.length + 1,
    };
    this.products.push(newProduct);
    this.productsSubject.next(this.products);
  }

  updateProduct(product: Product): void {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
      this.productsSubject.next(this.products);
    }
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter((p) => p.id !== id);
    this.productsSubject.next(this.products);
  }
}
