import { Routes } from '@angular/router';
import {ListingsAllPropertyComponent} from "./components/listings/listings.component";
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";
import {ResidentcreateComponent} from "../resident/components/create/residentcreate.component";

export const ResidentAllPropertylistingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ListingsAllPropertyComponent,
        data: {
          title: 'All Residents',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Residents'}
          ]
        }
      },
      {
        path: ':id/edit',
        component: ListingsAllPropertyComponent,
        data: {
          title: 'Edit Resident',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Residents', url: '/residentListing'},
            {title: 'Edit Resident'}
          ]
        }
      },
      {
        path: ':id/view',
        component: ListingsAllPropertyComponent,
        data: {
          title: 'View Captain',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Residents', url: '/residentListing'},
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
            {title: 'All Residents', url: '/residents'},
            {title: 'View Resident'}
          ]
        }
      }
    ]
  }
];
