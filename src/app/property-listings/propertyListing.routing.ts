import { Routes } from '@angular/router';
import {LocationListingComponent} from "./components/listings/locationlisting.component";
import {LocationEditComponent} from "./components/edit/locationedit.component";
import {LocationCreateComponent} from "./components/create/locationcreate.component";
import { ViewComponent } from './components/view/view.component';


export const PropertyListingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: LocationListingComponent,
        data: {
          title: 'Properties',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Properties'}
          ]
        }
      },
      {
        path: ':id/edit',
        component: LocationEditComponent,
        data: {
          title: 'Edit Property',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Properties', url: '/properties'},
            {title: 'Edit Property'}
          ]
        }
      },
      {
        path: ':id/view',
        component: ViewComponent,
        data: {
          title: 'View Property',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Properties', url: '/properties'},
            {title: 'View Property'}
          ]
        }
      },
      {
        path: 'create',
        component: LocationCreateComponent,
        data: {
          title: 'Create Property',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Properties', url: '/properties'},
            {title: 'Create Property'}
          ]
        }
      }
    ]
  }
];
