import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { ElasticsearchService } from './shared/elasticsearch.service';
import { Title } from '@angular/platform-browser';
import { routerTransition } from './animations/animations';
import { Store } from '@ngrx/store';
import { AppState } from './app-store/app.state';
import { HeaderState } from './models/header-state.enum';
import * as HeaderActions from './app-store/actions/header.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ElasticsearchService],
  animations: [routerTransition]
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private title: Title,
    private store: Store<AppState>) {
  }

  previousRoute: string;

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        if (this.router.url !== '/home') {
          this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Fixed));
          this.store.dispatch(new HeaderActions.ToggleMenu(false));
        }

        //Update Page path for Google Analytics
        (<any>window).gtag('config', 'UA-131214369-1', { 'page_path': event.urlAfterRedirects });

        //Update Page title
        switch (event.urlAfterRedirects) {
          case '/art':
            this.title.setTitle('Art | Collection of my artworks');
            break;
          case '/projects':
            this.title.setTitle('Projects | View my hobby projects');
            break;
          case '/blog':
            this.title.setTitle('Blog | My blog articles on technology and life');
            break;
          case '/about':
            this.title.setTitle('About | Learn more about me');
            break;
          case '/contact':
            this.title.setTitle('Contact | Connect with me on social network or reach out to me');
            break;
          default:
            this.title.setTitle('Jayabratha | My Portfolio | See my artworks, projects and blog')
        }

        //Scroll to top when route load
        if (this.previousRoute && this.previousRoute.split('/')[2] !== 'gallery' && event.urlAfterRedirects.split('/')[2] !== 'gallery') {
          window.scrollTo(0, 0);
        }

        this.previousRoute = event.urlAfterRedirects;
      }
    });
  }
}
