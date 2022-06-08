import { Routes } from '@angular/router';

import { Dashboard1Component } from './dashboard1/dashboard1.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    component: Dashboard1Component,
    pathMatch: 'full',
    data: {
      title: 'Home',
      urls: [
        { title: 'Home', url: '/dashboard' }
      ]
    }
  }
];
