import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { of } from 'rxjs';
import {
  StatisticsService,
  PublicationsPerUser,
  CommentsPerPeriod,
  CommentsPerPublication,
} from '../../../services/statistics/statistics.service';
import { ToastService } from '../../../core/services/toast.service';
import { ButtonBaseComponent } from '../../../core/components/buttons/button-base/button-base.component';
import { ButtonCommonModel } from '../../../core/models/buttons/button-common.model';

@Component({
  selector: 'app-admin-statistics',
  standalone: true,
  imports: [FormsModule, ChartModule, DatePickerModule, ButtonBaseComponent],
  templateUrl: './admin-statistics.html',
  styleUrls: ['./admin-statistics.css'],
})
export class AdminStatistics implements OnInit {
  private readonly _statisticsService = inject(StatisticsService);
  private readonly _toastService = inject(ToastService);

  public readonly loading = signal<boolean>(false);
  public readonly fromDate = signal<Date | null>(null);
  public readonly toDate = signal<Date | null>(null);

  public readonly barData = signal<any>(null);
  public readonly barOptions = signal<any>(null);
  public readonly doughnutData = signal<any>(null);
  public readonly doughnutOptions = signal<any>(null);
  public readonly lineData = signal<any>(null);
  public readonly lineOptions = signal<any>(null);

  public readonly filterButtonModel = signal(
    new ButtonCommonModel({
      label: 'Filtrar',
      iconName: 'pi pi-search',
      permission: of({ allowed: true }),
      action: () => this.loadStatistics(),
    }),
  );

  public readonly clearButtonModel = signal(
    new ButtonCommonModel({
      label: 'Limpiar',
      iconName: 'pi pi-times',
      style: 'outlined',
      permission: of({ allowed: true }),
      action: () => this.clearDates(),
    }),
  );

  public ngOnInit(): void {
    this._initChartOptions();
    this.loadStatistics();
  }

  private _initChartOptions(): void {
    const textColor = '#e6fff9';
    const gridColor = 'rgba(255, 255, 255, 0.08)';

    this.barOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
        y: {
          beginAtZero: true,
          ticks: { color: textColor, stepSize: 1 },
          grid: { color: gridColor },
        },
      },
    });

    this.doughnutOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, padding: 16 },
        },
      },
    });

    this.lineOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
        y: {
          beginAtZero: true,
          ticks: { color: textColor, stepSize: 1 },
          grid: { color: gridColor },
        },
      },
    });
  }

  public loadStatistics(): void {
    this.loading.set(true);

    const from = this.fromDate()?.toISOString();
    const to = this.toDate()?.toISOString();

    this._statisticsService.getPublicationsPerUser(from, to).subscribe({
      next: (data) => this._buildBarChart(data),
      error: () => this._toastService.showError('Error al cargar publicaciones por usuario'),
    });

    this._statisticsService.getCommentsPerPeriod(from, to).subscribe({
      next: (data) => this._buildDoughnutChart(data),
      error: () => this._toastService.showError('Error al cargar comentarios por período'),
    });

    this._statisticsService.getCommentsPerPublication(from, to).subscribe({
      next: (data) => {
        this._buildLineChart(data);
        this.loading.set(false);
      },
      error: () => {
        this._toastService.showError('Error al cargar comentarios por publicación');
        this.loading.set(false);
      },
    });
  }

  public clearDates(): void {
    this.fromDate.set(null);
    this.toDate.set(null);
    this.loadStatistics();
  }

  private _buildBarChart(data: PublicationsPerUser[]): void {
    const labels = data.map((d) => `${d.name} ${d.lastName}`);
    const values = data.map((d) => d.count);

    this.barData.set({
      labels,
      datasets: [
        {
          label: 'Publicaciones',
          data: values,
          backgroundColor: 'rgba(64, 224, 198, 0.6)',
          borderColor: '#40e0c6',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    });
  }

  private _buildDoughnutChart(data: CommentsPerPeriod[]): void {
    const labels = data.map((d) => d.date);
    const values = data.map((d) => d.count);

    const colors = [
      '#40e0c6',
      '#3977aa',
      '#3bb89f',
      '#1f5950',
      '#88e4cc',
      '#2a9f8f',
      '#e6b95a',
      '#d64545',
      '#2f9e6f',
    ];

    this.doughnutData.set({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors.slice(0, values.length),
          borderColor: '#0e1616',
          borderWidth: 2,
        },
      ],
    });
  }

  private _buildLineChart(data: CommentsPerPublication[]): void {
    const labels = data.map((d) =>
      d.title.length > 20 ? d.title.substring(0, 20) + '...' : d.title,
    );
    const values = data.map((d) => d.commentsCount);

    this.lineData.set({
      labels,
      datasets: [
        {
          label: 'Comentarios',
          data: values,
          borderColor: '#3977aa',
          backgroundColor: 'rgba(57, 119, 170, 0.2)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#3977aa',
          pointBorderColor: '#0e1616',
          pointBorderWidth: 2,
        },
      ],
    });
  }
}
