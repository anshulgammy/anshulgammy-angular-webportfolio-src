import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app-store/app.state';
import { Header } from '../models/header.model';
import { HeaderState } from '../models/header-state.enum';
import * as HeaderActions from '../app-store/actions/header.actions';
import { takeUntil } from 'rxjs/operators';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './../app.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  HEADER_STATE = HeaderState;
  headerState: HeaderState;
  screenWidth: number = window.innerWidth;
  autoScrolling: boolean = false;
  steps: Array<{
    tileName: string,
    isAboveView: boolean,
    isBelowView: boolean
  }> = [{
    tileName: '',
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'art-overview',
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'projects-overview',
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'blog-overview',
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'about-overview',
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'contact-overview',
    isAboveView: false,
    isBelowView: false
  }];
  stepCount: number = 0;
  decounce: boolean = false;
  isMobile: boolean = false;
  padding: number = 200;
  subs: Subscription;

  constructor(private store: Store<AppState>, private homeService: HomeService) { }

  private onDestroy$ = new Subject();

  ngOnInit() {
    let deviceWidth = window.innerWidth;

    if (deviceWidth < 650) {
      this.isMobile = true;
    }

    this.homeService.getSlideCount().subscribe((slideCount) => {
      this.setStepCount(slideCount);
    });

    this.subs = this.store.select((state: AppState) => state.header.state)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((headerState: HeaderState) => {
        this.headerState = headerState;
        if (this.headerState === HeaderState.Home) {
          this.homeService.setSlideCount(0);
        }
      });

    if (this.headerState === HeaderState.Fixed) {
      this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Home))
    }

    if (!this.isMobile) {
      setTimeout(() => {
        this.store.dispatch(new HeaderActions.ToggleMenu(true));
      }, 500);
    }
  }

  setStepCount(stepCount) {
    let height = 75;
    let nextScrollPosition = 0;
    let firstScrollPosition = (95 * window.innerHeight) / 100;
    this.autoScrolling = true;

    console.log(stepCount);

    if (this.isMobile) {
      height = 86;
    }

    if (stepCount === 1) {
      if (this.isMobile) {
        nextScrollPosition = (165 * this.screenWidth) / 100;
      } else {
        nextScrollPosition = firstScrollPosition;
      }
    } else if (stepCount) {
      nextScrollPosition = firstScrollPosition + (stepCount - 1) * (height * window.innerHeight) / 100;
    }

    window.scrollTo(0, nextScrollPosition);

    this.stepCount = stepCount;

    setTimeout(() => {
      this.autoScrolling = false;
    }, 2000);
  }

  // @HostListener('window:wheel', ['$event'])
  // onWheelRotate(ev) {
  //   let delta, stepCount;
  //   if (!this.isMobile) {
  //     if (!this.decounce) {
  //       if (ev.wheelDelta) {
  //         delta = ev.wheelDelta;
  //       } else {
  //         delta = -1 * ev.deltaY;
  //       }

  //       if (delta < 0) {
  //         stepCount = this.stepCount < 5 ? this.stepCount + 1 : 5;
  //         this.setStepCount(stepCount);
  //       } else {
  //         stepCount = this.stepCount > 0 ? this.stepCount - 1 : 0;
  //         this.setStepCount(stepCount);
  //       }

  //       this.decounce = true;
  //       setTimeout(() => {
  //         this.decounce = false;
  //       }, 1000);
  //     }
  //   }
  // }

  handleCardInView(stepCount) {
    if (!this.autoScrolling) {
      console.log(stepCount);
      this.stepCount = stepCount;
    }
  }
  @HostListener('window:keydown', ['$event'])
  onArrowUpDown(ev) {
    let keycode = ev.code;

    if (keycode === "ArrowDown" && this.stepCount < 5) {
      ev.preventDefault();
      this.setStepCount(this.stepCount + 1);
    } else if (keycode === "ArrowUp" && this.stepCount > 0) {
      ev.preventDefault();
      this.setStepCount(this.stepCount - 1);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
