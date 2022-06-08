import { Routes } from '@angular/router';

import {ViewComponent} from "./components/view/view.component";
import {EditComponent} from "./components/edit/edit.component";
import {ListingComponent} from "./components/listing/listing.component";
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";
import {CaptaincreateComponent} from "./components/create/captaincreate.component";

export const CaptainsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ListingComponent,
        data: {
          title: 'All Captains',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Captains'}
          ]
        }
      },
      {
        path: ':id/edit',
        component: EditComponent,
        data: {
          title: 'Edit Captain',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Captains', url: '/captains'},
            {title: 'Edit Captain'}
          ]
        }
      },
      {
        path: ':id/view',
        component: ViewComponent,
        data: {
          title: 'View Captain',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Captains', url: '/captains'},
            {title: 'View Captain'}
          ]
        }
      },
      {
        path: 'create',
        component: CaptaincreateComponent,
        data: {
          title: 'Add Captain',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Captains', url: '/captains'},
            {title: 'Add Captain'}
          ]
        }
      }
    ]
  }
];
