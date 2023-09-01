import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  chart: Chart | any;

  @Input() annotations: any[] = [];
  @Input() annotationLabels: { xMax: string, xMin: string, backgroundColor: string } =
    { xMax: '', xMin: '', backgroundColor: '' };
  @Input() borderColor: string = 'rgb(75, 192, 192)';
  @Input() chartName: string = '';
  @Input() chartType: ChartType = 'line';
  @Input() inputData: any[] = [];
  @Input() inputDataLabels: { xLabel: string, yLabel: string } = { xLabel: '', yLabel: '' };
  @Input() yMax: number = -Infinity;

  ngOnInit(): void {
    const canvas: HTMLCanvasElement = document.getElementById('default') as HTMLCanvasElement;
    canvas.id = this.chartName;
    this.createChart();
    this.addChart(this.inputData);
    this.addAnnotations();
  }

  createChart(): void {
    Chart.register(annotationPlugin);
    this.chart = new Chart(this.chartName, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            borderColor: 'rgb(75, 192, 192)',
            data: [],
            label: this.inputDataLabels.xLabel,
            fill: false,
            pointStyle: false,
            tension: 0.1,
          },
        ]
      },
      options: {
        plugins: {
          annotation: {
            annotations: {}
          }
        }
      }
    });
  }

  addChart(inputData: any[]): void {
    this.chart.data.labels = inputData.map((data) => data[this.inputDataLabels.yLabel]);
    this.chart.data.datasets[0].data = inputData.map((data) => data[this.inputDataLabels.xLabel]);
    this.chart.update();
  }

  addAnnotation(backgroundColor: string, xMin: number, xMax: number, yMax: number, boxName: string): void {
    let plugins = this.chart.options.plugins;
    plugins.annotation.annotations[boxName] = {
      backgroundColor,
      scaleId: 'y',
      type: 'box',
      xMax,
      xMin,
      yMax,
      yMin: 0
    };
    this.chart.update();
  }

  addAnnotations(): void {
    this.deleteWarnings();
    this.annotations.map((annotation): void => {
      this.addAnnotation(
        this.rgbAnnotationColor(annotation[this.annotationLabels.backgroundColor]),
        annotation[this.annotationLabels.xMin],
        annotation[this.annotationLabels.xMax],
        this.yMax,
        `box-${annotation[this.annotationLabels.xMin]}-${annotation[this.annotationLabels.xMax]}`
      );
    });
  }

  deleteWarnings(): void {
    Object.keys(this.chart.options.plugins.annotation.annotations).forEach((key: string): void => {
      delete this.chart.options.plugins.annotation.annotations[key];
    });
    this.chart.update();
  }

  protected rgbAnnotationColor(colorAnnotation: string): string {
    if (colorAnnotation === 'red') {
      return 'rgba(246, 65, 45, 0.5)';
    } else if (colorAnnotation === 'orange') {
      return 'rgba(255, 152, 0, 0.5)';
    }

    return 'rgba(255, 236, 25, 0.5)';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputData'] && this.chart) {
      this.addChart(changes['inputData'].currentValue);
    }
    if (changes['annotations'] && this.chart) {
      this.addAnnotations();
    }
  }
}
