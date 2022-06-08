import { Routes } from '@angular/router';
import { PropertyComponent } from './property/property.component';
export const PropertyRoutes: Routes = [
  {
    path: ':id',
    component: PropertyComponent,
    data: {
      title: '',
      urls: [
        { title: 'Home', url: '/dashboard' },
        { title: 'Property' }
      ]
    }
  },
];
