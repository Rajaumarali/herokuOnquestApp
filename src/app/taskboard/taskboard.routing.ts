import { Routes } from '@angular/router';
import { TaskboardComponent } from "./taskboard/taskboard.component";
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";

export const TasksBoardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: TaskboardComponent,
        data: {
          title: 'Taskboard',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Taskboard'}
          ]
        }
      }
    ]
  }
];
