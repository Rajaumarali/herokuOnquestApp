import { Routes } from '@angular/router';
import {ListingsComponent} from "./components/listings/listings.component";
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";

export const TaskslistingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ListingsComponent,
        data: {
          title: 'Tasks This Week',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Tasks This Week'}
          ]
        }
      },
      {
        path: ':id/edit',
        component: ListingsComponent,
        data: {
          title: 'Edit Resident',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Residents', url: '/residents'},
            {title: 'Edit Resident'}
          ]
        }
      },
      {
        path: ':id/view',
        component: ListingsComponent,
        data: {
          title: 'View Captain',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Residents', url: '/residents'},
            {title: 'View Resident'}
          ]
        }
      }
    ]
  }
];
