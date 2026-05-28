import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-timer',
  imports: [NgClass],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent {
  public readonly initialTime = input<number>(60);
  public readonly resetTimer = input<number>(0);
  public readonly paused = input<boolean>(false);
  public timeIsFinished = output<boolean>();

  private readonly _remainingTime = signal<number>(60);
  private readonly _warningTime = signal<number>(15);

  public readonly isFinished = computed(() => this._remainingTime() === 0);
  public readonly isAboutToFinish = computed(() => this._remainingTime() <= this._warningTime());
  public readonly formattedTime = computed(() => this.formatTime(this._remainingTime()));

  constructor() {
    effect((onCleanup) => {
      this.resetTimer();
      this._remainingTime.set(this.initialTime());

      if (this.initialTime() === 0) {
        return;
      }

      const intervalId = setInterval(() => {
        if (this.paused()) {
          return;
        }

        const nextValue = this._remainingTime() - 1;

        if (nextValue <= 0) {
          this._remainingTime.set(0);
          clearInterval(intervalId);
          this.timeIsFinished.emit(true);
          return;
        }

        this._remainingTime.set(nextValue);
      }, 1000);

      onCleanup(() => clearInterval(intervalId));
    });
  }

  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
  }
}
