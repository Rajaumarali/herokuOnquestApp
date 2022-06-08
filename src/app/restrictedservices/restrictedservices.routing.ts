import { Routes } from '@angular/router';

import {ServiceeditComponent} from "./components/serviceedit/serviceedit.component";
import {ServicelistingComponent} from "./components/servicelisting/servicelisting.component";
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";
import {ServicecreateComponent} from "./components/servicecreate/servicecreate.component";

export const RestrictedServicesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ServicelistingComponent,
        data: {
          title: 'Restricted Services',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Services', url: '/services'},
            {title: 'Restricted Services'}
          ]
        }
      },
      {
        path: ':id/edit',
        component: ServiceeditComponent,
        data: {
          title: 'Edit Restricted Service',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Restricted Services', url: '/restrictedservices'},
            {title: 'Edit Service'}
          ]
        }
      },
      {
        path: 'create',
        component: ServicecreateComponent,
        data: {
          title: 'Create Restricted Service',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Restricted Services', url: '/restrictedservices'},
            {title: 'Create Service'}
          ]
        }
      }
    ]
  }
];
