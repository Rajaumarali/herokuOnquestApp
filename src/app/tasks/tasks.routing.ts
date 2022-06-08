import { Routes } from '@angular/router';

import {ViewComponent} from "./components/view/view.component";
import {EditComponent} from "./components/edit/edit.component";
import {ListingsComponent} from "./components/listings/listings.component";
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";

export const TasksRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ListingsComponent,
        data: {
          title: 'All Tasks',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Tasks'}
          ]
        }
      },
      {
        path: ':id/edit',
        component: EditComponent,
        data: {
          title: 'Edit Task',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Tasks', url: '/tasks'},
            {title: 'Edit Tasks'}
          ]
        }
      },
      {
        path: ':id/view',
        component: ViewComponent,
        data: {
          title: 'View Task',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Tasks', url: '/tasks'},
            {title: 'View Task'}
          ]
        }
      }
    ]
  }
];
