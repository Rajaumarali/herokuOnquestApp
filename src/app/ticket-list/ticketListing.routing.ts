import { Routes } from '@angular/router';
import { ListingComponent } from './components/listing/listing.component';

export const TicketListingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ListingComponent,
        data: {
          title: 'All Tasks',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Property Tasks'}
          ]
        }
      }
    ]
  }
];
