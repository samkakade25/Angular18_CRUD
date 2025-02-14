import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductChartNgxComponent } from './product-chart-ngx.component';

describe('ProductChartNgxComponent', () => {
  let component: ProductChartNgxComponent;
  let fixture: ComponentFixture<ProductChartNgxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductChartNgxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductChartNgxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
