import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './product-chart.component.html',
  styleUrls: ['./product-chart.component.css'],
})
export class ProductChartComponent implements OnChanges {
  @Input() products: Product[] = [];

  chartData: any;
  chartOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    this.chartData = {
      labels: this.products.map((p) => p.name),
      datasets: [
        {
          label: 'Product Prices ($)',
          data: this.products.map((p) => p.price),
          backgroundColor: this.generateColors(this.products.length),
          borderColor: '#ffffff',
          borderWidth: 1,
        },
      ],
    };

    this.setupChartOptions();
  }

  private setupChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#495057',
          },
        },
        title: {
          display: true,
          text: 'Product Price Distribution',
          color: '#495057',
          font: {
            size: 16,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Price ($)',
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Products',
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
  }

  private generateColors(count: number): string[] {
    const baseColors = ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2'];
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  }
}
