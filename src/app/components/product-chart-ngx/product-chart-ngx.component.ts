import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-chart-ngx',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './product-chart-ngx.component.html',
  styleUrls: ['./product-chart-ngx.component.css'],
})
export class ProductChartNgxComponent implements OnChanges {
  @Input() products: Product[] = [];

  chartData: any[] = [];
  view: [number, number] = [700, 400];

  // Chart options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Products';
  yAxisLabel = 'Value';
  legendTitle = 'Metrics';
  animations = true;

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C'],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'] && this.products) {
      this.transformData();
    }
  }

  private transformData(): void {
    if (!this.products || this.products.length === 0) {
      this.chartData = [];
      return;
    }

    const top5Products = this.products.slice(0, 5);

    const chartData = [
      {
        name: 'Price',
        series: top5Products.map((product) => ({
          name: product.name,
          value: Number(product.price) || 0,
        })),
      },
      {
        name: 'Quantity',
        series: top5Products.map((product) => ({
          name: product.name,
          value: Number(product.quantity) || 0,
        })),
      },
      {
        name: 'Total Value',
        series: top5Products.map((product) => ({
          name: product.name,
          value: Number(product.price * (product.quantity || 0)) || 0,
        })),
      },
    ];

    // Only update chartData if we have valid data
    if (chartData[0].series.length > 0) {
      this.chartData = chartData;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    const width = window.innerWidth;
    this.view = [width > 768 ? 700 : width - 50, 400];
  }

  onSelect(event: any): void {
    console.log('Item clicked:', event);
  }
}
