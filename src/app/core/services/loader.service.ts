import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoading$$ = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();

  private requestCount = 0;

  show() {
    this.requestCount++;
    this.updateLoadingState();
  }

  hide() {
    this.requestCount--;
    if (this.requestCount < 0) {
      this.requestCount = 0;
    }
    this.updateLoadingState();
  }

  private updateLoadingState() {
    if (this.requestCount > 0) {
      this.isLoading$$.next(true);
    } else {
      this.isLoading$$.next(false);
    }
  }
}
