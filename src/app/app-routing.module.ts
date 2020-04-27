import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, data: {state: 'home'} },
  { path: 'art', loadChildren: './art/art.module#ArtModule', data: {state: 'art'}},
  { path: 'projects', component: ProjectsComponent, data: {state: 'projects'} },
  { path: 'blog', loadChildren: './blog/blog.module#BlogModule', data: {state: 'blog'} },
  { path: 'about', component: AboutComponent, data: {state: 'about'} },
  { path: 'contact', component: ContactComponent, data: {state: 'contact'} },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [    
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
