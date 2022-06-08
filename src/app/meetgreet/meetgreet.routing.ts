import { Routes } from '@angular/router';
import { MeetGreetListingComponent } from './component/listing/listing.component';

export const MeetGreetRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MeetGreetListingComponent,
        data: {
          title: 'Meet & Greets',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Property Meet & Greets'}
          ]
        }
      }
    ]
  }
];
