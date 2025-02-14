import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly STORAGE_KEY = 'products';
  private products$ = new BehaviorSubject<Product[]>([]);
  private currentId = 1;

  constructor() {
    this.loadProductsFromStorage();
  }

  private loadProductsFromStorage(): void {
    const savedProducts = localStorage.getItem(this.STORAGE_KEY);
    if (savedProducts) {
      const products = JSON.parse(savedProducts);
      this.currentId = Math.max(...products.map((p: Product) => p.id || 0)) + 1;
      this.products$.next(products);
    }
  }

  private saveToStorage(products: Product[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    this.products$.next(products);
  }

  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  addProduct(product: Product): void {
    const products = this.products$.value;
    const newProduct = { ...product, id: this.currentId++ };
    this.saveToStorage([...products, newProduct]);
  }

  updateProduct(updatedProduct: Product): void {
    const products = this.products$.value;
    const index = products.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      this.saveToStorage([...products]);
    }
  }

  deleteProduct(id: number): void {
    const products = this.products$.value;
    this.saveToStorage(products.filter((p) => p.id !== id));
  }
}
