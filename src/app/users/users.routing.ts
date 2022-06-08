import { Routes } from '@angular/router';

import {ListingsComponent} from "./components/listings/listings.component";
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";
import {CreateComponent} from "./components/create/create.component";
import { EditComponent } from './components/edit/edit.component';
import { ViewComponent } from './components/view/view.component';

export const UsersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ListingsComponent,
        data: {
          title: 'All Users',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Users'}
          ]
        }
      },{
        path: ':id/edit',
        component: EditComponent,
        data: {
          title: 'Edit User',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Users', url: '/users'},
            {title: 'Edit User'}
          ]
        }
      },{
        path: ':id/view',
        component: ViewComponent,
        data: {
          title: 'View User',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Users', url: '/users'},
            {title: 'View User'}
          ]
        }
      },
      {
        path: 'create',
        component: CreateComponent,
        data: {
          title: 'Create Users',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Users', url: '/users'},
            {title: 'Create User'}
          ]
        }
      }
    ]
  }
];
