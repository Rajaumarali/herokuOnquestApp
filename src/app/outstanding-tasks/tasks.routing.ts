import { Routes } from '@angular/router';
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";
import { TasksComponent } from './components/tasks/tasks.component';

export const TasksOutRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: TasksComponent,
        data: {
          title: 'Outstanding Tasks',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Outstanding Tasks'}
          ]
        }
      },
      {
        path: ':id/edit',
        component: TasksComponent,
        data: {
          title: 'Edit Resident',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Outstanding Tasks', url: '/outstanding/tasks'},
            {title: 'Outstanding Tasks'}
          ]
        }
      },
      {
        path: ':id/view',
        component: TasksComponent,
        data: {
          title: 'View Captain',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Outstanding Tasks', url: '/outstanding/tasks'},
            {title: 'View Tasks'}
          ]
        }
      }
    ]
  }
];
