import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  private readonly loadingService = inject(LoadingService);
  readonly isLoading = this.loadingService.isLoading;
}
