import { Routes } from '@angular/router';

import {ServiceeditComponent} from "./components/serviceedit/serviceedit.component";
import {ServiceviewComponent} from "./components/serviceview/serviceview.component";
import {ServicelistingComponent} from "./components/servicelisting/servicelisting.component";
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";

export const ServiceRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ServicelistingComponent,
        data: {
          title: 'Services',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Services'}
          ]
        }
      },
      {
        path: ':id/edit',
        component: ServiceeditComponent,
        data: {
          title: 'Edit Service',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Services', url: '/services'},
            {title: 'Edit Service'}
          ]
        }
      },
      {
        path: ':id/view',
        component: ServiceviewComponent,
        data: {
          title: 'View Service',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Services', url: '/services'},
            {title: 'View Service'}
          ]
        }
      }
    ]
  }
];
