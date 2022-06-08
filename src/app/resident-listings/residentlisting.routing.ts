import { Routes } from '@angular/router';
import {ListingsComponent} from "./components/listings/listings.component";
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";
import {ResidentcreateComponent} from "../resident/components/create/residentcreate.component";

export const ResidentlistingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ListingsComponent,
        data: {
          title: 'New Residents',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'New Residents'}
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
            {title: 'New Residents', url: '/residentListing'},
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
            {title: 'New Residents', url: '/residentListing'},
            {title: 'View Resident'}
          ]
        }
      },
      {
        path: 'create',
        component: ResidentcreateComponent,
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
