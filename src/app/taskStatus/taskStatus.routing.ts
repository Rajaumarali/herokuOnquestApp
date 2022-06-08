import { Routes } from '@angular/router';
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";
import { TaskListStatusComponent } from './components/lists.component';

export const TaskStatusRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: TaskListStatusComponent,
        data: {
          title: 'Tasks',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Tasks'}
          ]
        }
      },
      
    ]
  }
];
