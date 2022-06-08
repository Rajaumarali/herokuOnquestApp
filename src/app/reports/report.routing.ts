import { Routes } from '@angular/router';
import {ReportsComponent} from "./report/reports.component";
import {ViewreportsComponent} from "./view/viewreports.component";

export const ReportRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ReportsComponent,
        data: {
          title: 'Reports',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Reports'}
          ]
        }
      },
      {
        path: ':id/view',
        component: ViewreportsComponent,
        data: {
          title: 'View Report',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Reports', url: '/reports'},
            {title: 'View Report'}
          ]
        }
      }
    ]
  }
];
